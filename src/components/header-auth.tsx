"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Reads the session in the browser, so marketing pages stay fully static.
export function HeaderAuth() {
  const t = useTranslations("header");

  return (
    <>
      <Show when="signed-out">
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "ghost" })}
          >
            {t("signIn")}
          </Link>
          <Link href="/sign-up" className={buttonVariants()}>
            {t("getStarted")}
          </Link>
        </div>
      </Show>
      <Show when="signed-in">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "hidden sm:inline-flex",
          )}
        >
          {t("dashboard")}
        </Link>
        <div className="mx-1 flex size-7 items-center justify-center">
          <UserButton />
        </div>
      </Show>
    </>
  );
}
