import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// /en/dashboard, /pt/dashboard/settings, ... The first group is the locale prefix.
const privatePath = /^\/([^/]+)\/dashboard(\/|$)/;

export default clerkMiddleware(
  async (auth, request) => {
    const { pathname } = request.nextUrl;

    // API routes have no locale.
    if (pathname.startsWith("/api")) return;

    // Not the security boundary: every private page also calls auth.protect().
    // This only gives signed-out visitors a real redirect before rendering starts.
    if (privatePath.test(pathname)) {
      const { isAuthenticated, redirectToSignIn } = await auth();
      if (!isAuthenticated) return redirectToSignIn();
    }

    return intlMiddleware(request);
  },
  (request) => {
    // Sign-in opens in the language of the private page that was requested.
    const prefix = request.nextUrl.pathname.match(privatePath)?.[1];
    const base = prefix ? `/${prefix}` : "";

    return { signInUrl: `${base}/sign-in`, signUpUrl: `${base}/sign-up` };
  },
);

export const config = {
  // Pages and API routes. Skips Next.js internals and files with an extension.
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
