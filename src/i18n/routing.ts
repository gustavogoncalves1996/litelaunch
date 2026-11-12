import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-PT"],
  defaultLocale: "en",
  // European Portuguese formatting (19 €) while keeping the short /pt URL.
  localePrefix: {
    mode: "always",
    prefixes: { "pt-PT": "/pt" },
  },
});

export type Locale = (typeof routing.locales)[number];

// For values that come from outside the app: Server Action arguments, database rows.
export function toLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  "pt-PT": "Português",
};
