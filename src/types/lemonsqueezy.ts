import type { SubscriptionStatus } from "./database";

// The fields of a Lemon Squeezy subscription that this app reads.
// Full reference: https://docs.lemonsqueezy.com/api/subscriptions
export type LemonSqueezySubscription = {
  type: "subscriptions";
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    product_name: string;
    variant_id: number;
    variant_name: string;
    user_email: string;
    status: SubscriptionStatus;
    renews_at: string | null;
    ends_at: string | null;
    trial_ends_at: string | null;
    urls: {
      customer_portal: string;
      update_payment_method: string;
    };
  };
};

export type LemonSqueezyCheckout = {
  type: "checkouts";
  id: string;
  attributes: { url: string };
};

// Body of a subscription webhook. `custom_data` is what createCheckoutUrl()
// attached to the checkout.
export type SubscriptionWebhookEvent = {
  meta: {
    event_name: `subscription_${string}`;
    custom_data?: { user_id?: string };
  };
  data: LemonSqueezySubscription;
};
