import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signUp") };
}

export default function SignUpPage() {
  return (
    // <SignUp> reads the URL, which Cache Components only allows inside Suspense.
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
