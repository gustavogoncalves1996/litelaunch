import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Uses the secret key, which bypasses Row Level Security. Only for trusted
// server code that has already decided what the caller is allowed to do.
export function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
