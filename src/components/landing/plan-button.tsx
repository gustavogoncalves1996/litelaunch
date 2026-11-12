"use client";

import { useAuth } from "@clerk/nextjs";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";
import { startCheckout } from "@/actions/billing";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  paid: boolean;
  featured: boolean;
  children: ReactNode;
};

export function PlanButton({ paid, featured, children }: Props) {
  const { isSignedIn } = useAuth();
  const locale = useLocale();
  const variant = featured ? "default" : "outline";

  // A signed-in user goes straight to the checkout of a paid plan. Everyone
  // else, and the prerendered HTML, gets a link.
  if (isSignedIn && paid) {
    return (
      <form action={startCheckout.bind(null, locale)} className="mt-6">
        <SubmitButton variant={variant} className="w-full">
          {children}
        </SubmitButton>
      </form>
    );
  }

  return (
    <Link
      href={isSignedIn ? "/dashboard" : "/sign-up"}
      className={cn(buttonVariants({ variant }), "mt-6 w-full")}
    >
      {children}
    </Link>
  );
}
