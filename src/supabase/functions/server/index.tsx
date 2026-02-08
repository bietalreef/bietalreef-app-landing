import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Platform", "X-User-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ─── Platform Detection Middleware ───
// Tags each request with platform info for analytics/routing
app.use('*', async (c, next) => {
  const platform = c.req.header('X-Platform') || 'unknown';
  const userType = c.req.header('X-User-Type') || 'unknown';
  c.set('platform' as any, platform);
  c.set('userType' as any, userType);
  console.log(`[Platform: ${platform}] [User: ${userType}] ${c.req.method} ${c.req.path}`);
  await next();
});

// ─── Helper: Authenticate user from Authorization header ───
async function authUser(authHeader: string | undefined) {
  if (!authHeader) return { user: null, error: 'No Authorization header' };
  const token = authHeader.split(' ')[1];
  if (!token) return { user: null, error: 'Invalid token format' };

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { user: null, error: error?.message || 'Unauthorized' };
  return { user, error: null };
}

// ─── Helper: Service Role Supabase Client ───
function adminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

// ─── Initialize Storage Bucket for Avatars ───
const AVATAR_BUCKET = 'make-ad34c09a-avatars';

async function initStorage() {
  try {
    const supabase = adminClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === AVATAR_BUCKET);
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(AVATAR_BUCKET, {
        public: true, // Avatars should be publicly accessible
      });
      if (error) console.log(`Bucket creation note: ${error.message}`);
      else console.log(`Storage bucket '${AVATAR_BUCKET}' created successfully`);
    } else {
      console.log(`Storage bucket '${AVATAR_BUCKET}' already exists`);
    }
  } catch (e: any) {
    console.log(`Storage init note: ${e.message}`);
  }
}
initStorage();

// ───────────────────────────────────────────────
// Health check
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/health", (c) => {
  return c.json({ status: "ok" });
});

// ───────────────────────────────────────────────
// SIGN UP (Admin)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = adminClient();
    
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
       const { data, error } = await supabase.auth.admin.updateUserById(
         existingUser.id, 
         { password: password, user_metadata: { name }, email_confirm: true }
       );
       
       if (error) {
         console.log("Update User Error:", error);
         return c.json({ error: error.message }, 400);
       }

       // Ensure wallet exists for existing user
       const wallet = await kv.get(`wallet:${existingUser.id}`);
       if (!wallet) {
         await kv.set(`wallet:${existingUser.id}`, { balance: 0, updated_at: new Date().toISOString() });
       }

       return c.json({ data });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log("Signup Error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create wallet for new user with 0 balance
    if (data?.user?.id) {
      await kv.set(`wallet:${data.user.id}`, { balance: 0, updated_at: new Date().toISOString() });
      console.log(`Wallet created for user ${data.user.id}`);
    }

    return c.json({ data });
  } catch (e: any) {
    console.log("Signup Exception:", e);
    return c.json({ error: e.message }, 500);
  }
});

// ───────────────────────────────────────────────
// PROFILE (Protected)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/profile", async (c) => {
    try {
        const { user, error: authError } = await authUser(c.req.header('Authorization'));
        if (!user) return c.json({ error: `Auth error while saving profile: ${authError}` }, 401);

        const body = await c.req.json();
        await kv.set(`profile:${user.id}`, body);
        
        return c.json({ success: true });
    } catch (e: any) {
        console.log("Profile save error:", e.message);
        return c.json({ error: `Profile save error: ${e.message}` }, 500);
    }
});

app.get("/make-server-ad34c09a/profile", async (c) => {
    try {
        const { user, error: authError } = await authUser(c.req.header('Authorization'));
        if (!user) return c.json({ error: `Auth error while fetching profile: ${authError}` }, 401);

        const profile = await kv.get(`profile:${user.id}`);
        return c.json(profile || {});
    } catch (e: any) {
        console.log("Profile fetch error:", e.message);
        return c.json({ error: `Profile fetch error: ${e.message}` }, 500);
    }
});

// ───────────────────────────────────────────────
// WALLET - Get Balance
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/wallet/balance", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error while fetching wallet balance: ${authError}` }, 401);

    let wallet = await kv.get(`wallet:${user.id}`);
    
    // Auto-create wallet if it doesn't exist
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
      await kv.set(`wallet:${user.id}`, wallet);
      console.log(`Auto-created wallet for user ${user.id}`);
    }

    return c.json({ balance: wallet.balance, updated_at: wallet.updated_at });
  } catch (e: any) {
    console.log("Wallet balance error:", e.message);
    return c.json({ error: `Wallet balance error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// WALLET - Spend Coins (Protected server-side only)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/wallet/spend", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error while spending coins: ${authError}` }, 401);

    const { amount, reason } = await c.req.json();
    
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount: must be a positive integer' }, 400);
    }

    // Get current balance
    let wallet = await kv.get(`wallet:${user.id}`);
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
    }

    // Check sufficient balance
    if (wallet.balance < amount) {
      return c.json({ 
        error: 'رصيد غير كافٍ', 
        errorCode: 'INSUFFICIENT_BALANCE',
        currentBalance: wallet.balance, 
        required: amount 
      }, 400);
    }

    // Deduct balance
    const newBalance = wallet.balance - amount;
    const now = new Date().toISOString();
    
    await kv.set(`wallet:${user.id}`, { balance: newBalance, updated_at: now });

    // Log to ledger
    const ledgerEntry = {
      type: 'spend',
      amount: -amount,
      reason: reason || 'استخدام أداة',
      created_at: now,
      user_id: user.id,
    };
    await kv.set(`wallet_ledger:${user.id}:${Date.now()}`, ledgerEntry);

    console.log(`User ${user.id} spent ${amount} coins. New balance: ${newBalance}. Reason: ${reason}`);

    return c.json({ 
      success: true, 
      balance: newBalance, 
      entry: ledgerEntry 
    });
  } catch (e: any) {
    console.log("Wallet spend error:", e.message);
    return c.json({ error: `Wallet spend error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// WALLET - Top Up / Add Coins
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/wallet/topup", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error while topping up wallet: ${authError}` }, 401);

    const { amount, reason, type } = await c.req.json();
    
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount: must be a positive integer' }, 400);
    }

    // Get current balance
    let wallet = await kv.get(`wallet:${user.id}`);
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
    }

    // Add balance
    const newBalance = wallet.balance + amount;
    const now = new Date().toISOString();
    
    await kv.set(`wallet:${user.id}`, { balance: newBalance, updated_at: now });

    // Log to ledger
    const ledgerEntry = {
      type: type || 'earn',
      amount: amount,
      reason: reason || 'شحن رصيد',
      created_at: now,
      user_id: user.id,
    };
    await kv.set(`wallet_ledger:${user.id}:${Date.now()}`, ledgerEntry);

    console.log(`User ${user.id} topped up ${amount} coins. New balance: ${newBalance}. Reason: ${reason}`);

    return c.json({ 
      success: true, 
      balance: newBalance, 
      entry: ledgerEntry 
    });
  } catch (e: any) {
    console.log("Wallet topup error:", e.message);
    return c.json({ error: `Wallet topup error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// WALLET - Get Ledger (Transaction History)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/wallet/ledger", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error while fetching wallet ledger: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`wallet_ledger:${user.id}:`);
    
    // Sort by created_at descending (newest first)
    const sorted = (entries || []).sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ entries: sorted });
  } catch (e: any) {
    console.log("Wallet ledger error:", e.message);
    return c.json({ error: `Wallet ledger error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// AVATAR - Upload Profile Picture
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/avatar/upload", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error while uploading avatar: ${authError}` }, 401);

    const formData = await c.req.formData();
    const file = formData.get('avatar');
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file provided. Send a file with key "avatar"' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image (jpg, png, webp)' }, 400);
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large. Maximum 5MB' }, 400);
    }

    const supabase = adminClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;

    // Upload to storage (upsert to replace old avatar)
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.log("Avatar upload error:", uploadError);
      return c.json({ error: `Upload error: ${uploadError.message}` }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Also save in KV profile
    const existingProfile = await kv.get(`profile:${user.id}`) || {};
    await kv.set(`profile:${user.id}`, { ...existingProfile, avatar_url: avatarUrl });

    // Update auth user metadata
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { avatar_url: avatarUrl }
    });

    console.log(`Avatar uploaded for user ${user.id}: ${avatarUrl}`);

    return c.json({ 
      success: true, 
      avatar_url: avatarUrl 
    });
  } catch (e: any) {
    console.log("Avatar upload exception:", e.message);
    return c.json({ error: `Avatar upload exception: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████  TikTok Content Publishing API Integration  ████████
// ═══════════════════════════════════════════════════════════════

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

function getTikTokClientKey() {
  return Deno.env.get('TIKTOK_CLIENT_KEY') || '';
}
function getTikTokClientSecret() {
  return Deno.env.get('TIKTOK_CLIENT_SECRET') || '';
}

// ─── TikTok OAuth Callback (Server-side) ───
// TikTok redirects here after user authorizes.
// The server exchanges the code for an access token and stores it.
app.get("/make-server-ad34c09a/tiktok/callback", async (c) => {
  try {
    const code = c.req.query('code');
    const state = c.req.query('state'); // contains userId
    const errorParam = c.req.query('error');

    if (errorParam) {
      console.log(`TikTok OAuth error: ${errorParam} - ${c.req.query('error_description')}`);
      return c.html(`
        <html><body><script>
          window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: '${errorParam}' }, '*');
          window.close();
        </script><p>خطأ في الربط. يمكنك إغلاق هذه النافذة.</p></body></html>
      `);
    }

    if (!code || !state) {
      return c.html(`
        <html><body><script>
          window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: 'missing_params' }, '*');
          window.close();
        </script><p>بيانات ناقصة. يمكنك إغلاق هذه النافذة.</p></body></html>
      `);
    }

    // Parse state to get userId
    let userId = '';
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      userId = stateData.userId || '';
    } catch {
      userId = state;
    }

    // Exchange code for access token
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-ad34c09a/tiktok/callback`;

    const tokenRes = await fetch(`${TIKTOK_API_BASE}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: getTikTokClientKey(),
        client_secret: getTikTokClientSecret(),
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('TikTok token exchange response:', JSON.stringify(tokenData));

    if (tokenData.error || !tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || 'token_exchange_failed';
      console.log(`TikTok token exchange failed: ${errMsg}`);
      return c.html(`
        <html><body><script>
          window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: '${errMsg}' }, '*');
          window.close();
        </script><p>فشل في الحصول على الصلاحيات. يمكنك إغلاق هذه النافذة.</p></body></html>
      `);
    }

    // Store tokens in KV (keyed by userId)
    const tokenRecord = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || '',
      open_id: tokenData.open_id || '',
      expires_in: tokenData.expires_in || 86400,
      refresh_expires_in: tokenData.refresh_expires_in || 0,
      scope: tokenData.scope || '',
      token_type: tokenData.token_type || 'Bearer',
      created_at: new Date().toISOString(),
    };

    if (userId) {
      await kv.set(`tiktok_token:${userId}`, tokenRecord);
      console.log(`TikTok token stored for user ${userId}, open_id: ${tokenRecord.open_id}`);
    }

    // Return HTML that notifies parent window and closes
    return c.html(`
      <html>
      <head><meta charset="utf-8"><title>تم الربط بنجاح</title></head>
      <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Cairo,sans-serif;direction:rtl;background:#f0fdf4;">
        <div style="text-align:center;padding:2rem;">
          <div style="font-size:4rem;margin-bottom:1rem;">✅</div>
          <h2 style="color:#15803d;">تم ربط تيك توك بنجاح!</h2>
          <p style="color:#666;">سيتم إغلاق هذه النافذة تلقائياً...</p>
        </div>
        <script>
          window.opener && window.opener.postMessage({
            type: 'tiktok_auth',
            success: true,
            open_id: '${tokenRecord.open_id}',
            username: '${tokenData.open_id || ''}'
          }, '*');
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
      </html>
    `);
  } catch (e: any) {
    console.log("TikTok callback exception:", e.message);
    return c.html(`
      <html><body><script>
        window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: 'server_error' }, '*');
        window.close();
      </script><p>خطأ في السيرفر. يمكنك إغلاق هذه النافذة.</p></body></html>
    `);
  }
});

// ─── TikTok: Refresh Access Token ───
app.post("/make-server-ad34c09a/tiktok/auth/refresh", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error refreshing TikTok token: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.refresh_token) {
      return c.json({ error: 'No TikTok refresh token found. Please reconnect.' }, 400);
    }

    const res = await fetch(`${TIKTOK_API_BASE}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: getTikTokClientKey(),
        client_secret: getTikTokClientSecret(),
        grant_type: 'refresh_token',
        refresh_token: tokenRecord.refresh_token,
      }),
    });

    const data = await res.json();
    if (data.error || !data.access_token) {
      return c.json({ error: `TikTok refresh failed: ${data.error_description || data.error}` }, 400);
    }

    const updated = {
      ...tokenRecord,
      access_token: data.access_token,
      refresh_token: data.refresh_token || tokenRecord.refresh_token,
      open_id: data.open_id || tokenRecord.open_id,
      expires_in: data.expires_in || 86400,
      created_at: new Date().toISOString(),
    };
    await kv.set(`tiktok_token:${user.id}`, updated);

    return c.json({ success: true, expires_in: updated.expires_in });
  } catch (e: any) {
    console.log("TikTok refresh error:", e.message);
    return c.json({ error: `TikTok refresh error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Get Connection Status ───
app.get("/make-server-ad34c09a/tiktok/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error checking TikTok status: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ connected: false });
    }

    // Check if token is expired
    const createdAt = new Date(tokenRecord.created_at).getTime();
    const expiresIn = (tokenRecord.expires_in || 86400) * 1000;
    const isExpired = Date.now() > createdAt + expiresIn;

    return c.json({
      connected: true,
      open_id: tokenRecord.open_id,
      scope: tokenRecord.scope,
      is_expired: isExpired,
      created_at: tokenRecord.created_at,
    });
  } catch (e: any) {
    console.log("TikTok status error:", e.message);
    return c.json({ error: `TikTok status error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Disconnect (Remove Token) ───
app.delete("/make-server-ad34c09a/tiktok/disconnect", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error disconnecting TikTok: ${authError}` }, 401);

    await kv.del(`tiktok_token:${user.id}`);
    console.log(`TikTok disconnected for user ${user.id}`);

    return c.json({ success: true });
  } catch (e: any) {
    console.log("TikTok disconnect error:", e.message);
    return c.json({ error: `TikTok disconnect error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Query Creator Info ───
app.post("/make-server-ad34c09a/tiktok/creator-info", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error fetching TikTok creator info: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/creator_info/query/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    const data = await res.json();
    console.log('TikTok creator info response:', JSON.stringify(data));

    if (data.error?.code !== 'ok') {
      return c.json({ error: `TikTok creator info error: ${data.error?.message || 'unknown'}`, raw: data }, 400);
    }

    return c.json({ success: true, data: data.data });
  } catch (e: any) {
    console.log("TikTok creator info error:", e.message);
    return c.json({ error: `TikTok creator info error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Publish Video (Direct Post) ───
app.post("/make-server-ad34c09a/tiktok/publish/video", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error publishing TikTok video: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const body = await c.req.json();
    const {
      title = '',
      privacy_level = 'SELF_ONLY',
      disable_duet = false,
      disable_comment = false,
      disable_stitch = false,
      video_cover_timestamp_ms = 1000,
      video_url,
    } = body;

    // Build the publish request body (PULL_FROM_URL)
    const publishBody: any = {
      post_info: {
        title,
        privacy_level,
        disable_duet,
        disable_comment,
        disable_stitch,
        video_cover_timestamp_ms,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url,
      },
    };

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(publishBody),
    });

    const data = await res.json();
    console.log('TikTok publish video response:', JSON.stringify(data));

    if (data.error?.code !== 'ok') {
      return c.json({ error: `TikTok publish video error: ${data.error?.message || 'unknown'}`, raw: data }, 400);
    }

    return c.json({ success: true, publish_id: data.data?.publish_id });
  } catch (e: any) {
    console.log("TikTok publish video error:", e.message);
    return c.json({ error: `TikTok publish video error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Publish Photo (Direct Post) ───
app.post("/make-server-ad34c09a/tiktok/publish/photo", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error publishing TikTok photo: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const body = await c.req.json();
    const {
      title = '',
      description = '',
      privacy_level = 'SELF_ONLY',
      disable_comment = false,
      auto_add_music = true,
      photo_cover_index = 0,
      photo_images = [],
    } = body;

    const publishBody = {
      post_info: {
        title,
        description,
        disable_comment,
        privacy_level,
        auto_add_music,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        photo_cover_index,
        photo_images,
      },
      post_mode: 'DIRECT_POST',
      media_type: 'PHOTO',
    };

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/content/init/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(publishBody),
    });

    const data = await res.json();
    console.log('TikTok publish photo response:', JSON.stringify(data));

    if (data.error?.code !== 'ok') {
      return c.json({ error: `TikTok publish photo error: ${data.error?.message || 'unknown'}`, raw: data }, 400);
    }

    return c.json({ success: true, publish_id: data.data?.publish_id });
  } catch (e: any) {
    console.log("TikTok publish photo error:", e.message);
    return c.json({ error: `TikTok publish photo error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Check Publish Status ───
app.post("/make-server-ad34c09a/tiktok/publish/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error checking TikTok publish status: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const { publish_id } = await c.req.json();
    if (!publish_id) return c.json({ error: 'publish_id is required' }, 400);

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/status/fetch/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id }),
    });

    const data = await res.json();
    console.log('TikTok publish status response:', JSON.stringify(data));

    return c.json({ success: true, data: data.data, error_info: data.error });
  } catch (e: any) {
    console.log("TikTok publish status error:", e.message);
    return c.json({ error: `TikTok publish status error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Get OAuth URL (for frontend) ───
app.get("/make-server-ad34c09a/tiktok/auth-url", async (c) => {
  try {
    const { user, error: authError } = await authUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: `Auth error generating TikTok auth URL: ${authError}` }, 401);

    const clientKey = getTikTokClientKey();
    if (!clientKey) {
      return c.json({ error: 'TikTok Client Key not configured. Please add TIKTOK_CLIENT_KEY.' }, 500);
    }

    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-ad34c09a/tiktok/callback`;
    const scope = 'user.info.basic,video.publish';
    const state = encodeURIComponent(JSON.stringify({ userId: user.id, ts: Date.now() }));

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;

    return c.json({
      auth_url: authUrl,
      redirect_uri: redirectUri,
      note: 'Make sure this redirect_uri is registered in your TikTok Developer Portal app settings.',
    });
  } catch (e: any) {
    console.log("TikTok auth URL error:", e.message);
    return c.json({ error: `TikTok auth URL error: ${e.message}` }, 500);
  }
});

Deno.serve(app.fetch);