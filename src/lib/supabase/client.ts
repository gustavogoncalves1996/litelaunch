"use client";

import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import type { Database } from "@/types/database";

// Supabase in Client Components. It sends the Clerk session token, so Row
// Level Security limits it to the signed-in user's rows.
export function useSupabase() {
  // This getToken waits for Clerk to load. Reading the token from useSession()
  // instead would send the first queries without a session, and they would fail.
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          // Client Components also render on the server, where this getToken
          // throws and Supabase asks for a token as soon as the client is created.
          accessToken: async () =>
            typeof window === "undefined" ? null : getToken(),
        },
      ),
    [getToken],
  );
}
