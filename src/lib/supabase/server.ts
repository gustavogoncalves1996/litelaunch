import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Acts as the signed-in user: Supabase verifies the Clerk session token and
// Row Level Security limits every query to that user's rows.
export function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { accessToken: async () => (await auth()).getToken() },
  );
}
