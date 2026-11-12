import "server-only";

import type {
  LemonSqueezyCheckout,
  LemonSqueezySubscription,
} from "@/types/lemonsqueezy";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.lemonsqueezy.com/v1${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Lemon Squeezy: ${response.status} on ${path}`);
  }

  return (await response.json()) as T;
}

type Checkout = {
  userId: string;
  email: string;
  name: string | null;
  locale: string;
  redirectUrl: string;
};

// Creates a checkout for the Pro variant and returns its URL. The user ID
// travels with the checkout and comes back in every webhook of the subscription.
export async function createCheckoutUrl({
  userId,
  email,
  name,
  locale,
  redirectUrl,
}: Checkout) {
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;

  const { data } = await request<{ data: LemonSqueezyCheckout }>("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email,
            name: name ?? undefined,
            custom: { user_id: userId },
          },
          // Lemon Squeezy takes a language without a region: "pt", not "pt-PT".
          checkout_options: { locale: new Intl.Locale(locale).language },
          product_options: {
            redirect_url: redirectUrl,
            enabled_variants: [Number(variantId)],
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID! },
          },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  return data.attributes.url;
}

export async function fetchSubscription(id: string) {
  const { data } = await request<{ data: LemonSqueezySubscription }>(
    `/subscriptions/${encodeURIComponent(id)}`,
  );

  return data;
}
