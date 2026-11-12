import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signIn") };
}

export default function SignInPage() {
  return (
    // <SignIn> reads the URL, which Cache Components only allows inside Suspense.
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
