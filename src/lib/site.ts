export const siteConfig = {
  name: "LiteLaunch",
  // Absolute URL of the site, for links in emails.
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const navLinks = [
  { key: "features", href: "/#features" },
  { key: "pricing", href: "/#pricing" },
] as const;
