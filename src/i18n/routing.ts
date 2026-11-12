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

export const localeNames: Record<Locale, string> = {
  en: "English",
  "pt-PT": "Português",
};
