import { ptPT } from "@clerk/localizations/pt-PT";
import type { Locale } from "./routing";

// Translations for Clerk's own UI (sign-in, sign-up, user menu).
// English is built into Clerk, so it needs no entry.
export const clerkLocalizations: Partial<Record<Locale, typeof ptPT>> = {
  "pt-PT": ptPT,
};
