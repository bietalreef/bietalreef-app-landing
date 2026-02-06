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
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

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

Deno.serve(app.fetch);
