import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DemoUser {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "salesman" | "production_supervisor" | "owner" | "accountant";
}

const DEMO_USERS: DemoUser[] = [
  { email: "admin@anjanfoods.in", password: "AnjanAdmin#2026", fullName: "Anjali Reddy", role: "admin" },
  { email: "sales@anjanfoods.in", password: "AnjanSales#2026", fullName: "Karthik S", role: "salesman" },
  { email: "production@anjanfoods.in", password: "AnjanProd#2026", fullName: "Murugan V", role: "production_supervisor" },
  { email: "owner@anjanfoods.in", password: "AnjanOwner#2026", fullName: "Ramesh Nair", role: "owner" },
  { email: "accounts@anjanfoods.in", password: "AnjanAccts#2026", fullName: "Lakshmi P", role: "accountant" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const results: Array<{ email: string; status: string }> = [];

    for (const u of DEMO_USERS) {
      // Try to find existing user by email
      const { data: existing } = await admin.auth.admin.listUsers();
      const found = existing?.users?.find((x: { email?: string }) => x.email === u.email);

      let userId: string;

      if (found) {
        userId = found.id;
        // Update profile role/name in case it drifted
        await admin.from("profiles").upsert({
          id: userId,
          email: u.email,
          full_name: u.fullName,
          role: u.role,
          is_active: true,
        });
        results.push({ email: u.email, status: "updated" });
      } else {
        const { data: created, error } = await admin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.fullName, role: u.role },
        });
        if (error) {
          results.push({ email: u.email, status: `error: ${error.message}` });
          continue;
        }
        userId = created.user.id;
        // The handle_new_user trigger creates a profile row with default role 'salesman'.
        // Override role + name here.
        await admin.from("profiles").update({
          full_name: u.fullName,
          role: u.role,
        }).eq("id", userId);
        results.push({ email: u.email, status: "created" });
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
