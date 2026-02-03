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

// Health check endpoint
app.get("/make-server-ad34c09a/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign Up Route (Admin)
app.post("/make-server-ad34c09a/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    // Check if user exists first to provide better error or update password
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
       // Update password to ensure test user works
       const { data, error } = await supabase.auth.admin.updateUserById(
         existingUser.id, 
         { password: password, user_metadata: { name }, email_confirm: true }
       );
       
       if (error) {
         console.error("Update User Error:", error);
         return c.json({ error: error.message }, 400);
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
      console.error("Signup Error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ data });
  } catch (e: any) {
    console.error("Signup Exception:", e);
    return c.json({ error: e.message }, 500);
  }
});

// Save Profile (Protected)
app.post("/make-server-ad34c09a/profile", async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
        
        const token = authHeader.split(' ')[1];
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
        );
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

        const body = await c.req.json();
        // Key: profile:<userId>
        await kv.set(`profile:${user.id}`, body);
        
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// Get Profile (Protected)
app.get("/make-server-ad34c09a/profile", async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
        
        const token = authHeader.split(' ')[1];
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
        );
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

        const profile = await kv.get(`profile:${user.id}`);
        return c.json(profile || {});
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

Deno.serve(app.fetch);
