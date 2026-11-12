import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Subscription, SubscriptionStatus } from "@/types/database";

// Statuses that give access to the paid plan. "cancelled" is included because
// the customer keeps what they paid for until the period ends, and "past_due"
// because Lemon Squeezy is still retrying the payment.
const activeStatuses: SubscriptionStatus[] = [
  "on_trial",
  "active",
  "past_due",
  "cancelled",
];

// The signed-in user's most recent subscription, or null if they never had one.
export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data, error } = await createServerSupabaseClient()
    .from("subscriptions")
    .select()
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`getCurrentSubscription: ${error.message}`);

  return data;
}

export function hasActivePlan(
  subscription: Subscription | null,
): subscription is Subscription {
  return subscription !== null && activeStatuses.includes(subscription.status);
}

// A new checkout only makes sense without a subscription or after it ended.
// In any other status, the customer portal is where the customer fixes it.
export function canSubscribe(subscription: Subscription | null) {
  return subscription === null || subscription.status === "expired";
}
