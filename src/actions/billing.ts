"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect as navigate } from "next/navigation";
import { syncUser } from "@/actions/user";
import { getPathname, redirect } from "@/i18n/navigation";
import { toLocale } from "@/i18n/routing";
import { createCheckoutUrl, fetchSubscription } from "@/lib/lemonsqueezy";
import { siteConfig } from "@/lib/site";
import { canSubscribe, getCurrentSubscription } from "@/lib/subscription";

// Sends the signed-in user to a Lemon Squeezy checkout for the Pro plan.
export async function startCheckout(requestedLocale: string) {
  // A Server Action is a public endpoint: never trust its arguments.
  const locale = toLocale(requestedLocale);

  // Checks the session and makes sure the user row exists before the webhook
  // of the new subscription references it.
  const user = await syncUser(locale);

  // One subscription per user: the billing page is where an existing one is managed.
  if (!canSubscribe(await getCurrentSubscription())) {
    return redirect({ href: "/dashboard/billing", locale });
  }

  const billingPath = getPathname({ href: "/dashboard/billing", locale });
  const url = await createCheckoutUrl({
    userId: user.id,
    email: user.email,
    name: user.name,
    locale,
    redirectUrl: `${siteConfig.url}${billingPath}?checkout=success`,
  });

  navigate(url);
}

// Sends the signed-in user to the Lemon Squeezy customer portal, where they
// change the payment method, download invoices or cancel.
export async function openCustomerPortal(requestedLocale: string) {
  const locale = toLocale(requestedLocale);
  await auth.protect();

  // Read with the user's own session, so it can only be their subscription.
  const subscription = await getCurrentSubscription();
  if (!subscription) return redirect({ href: "/dashboard/billing", locale });

  // The portal URL is signed and expires, so it is requested on every click.
  const { attributes } = await fetchSubscription(subscription.id);

  navigate(attributes.urls.customer_portal);
}
