"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { useLocale } from "next-intl";
import {
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { getPathname } from "@/i18n/navigation";

type Props = {
  children: ReactNode;
  // Passed from the server layout so it is there on the first render: Clerk does
  // not reliably pick up a localization that arrives after its UI has mounted.
  localization: ComponentProps<typeof ClerkProvider>["localization"];
};

export function AuthProvider({ children, localization }: Props) {
  const locale = useLocale();
  const home = getPathname({ href: "/", locale });
  const dashboard = getPathname({ href: "/dashboard", locale });

  return (
    <ClerkProvider
      appearance={{ theme: shadcn }}
      localization={localization}
      signInUrl={getPathname({ href: "/sign-in", locale })}
      signUpUrl={getPathname({ href: "/sign-up", locale })}
      signInFallbackRedirectUrl={dashboard}
      signUpFallbackRedirectUrl={dashboard}
      afterSignOutUrl={home}
    >
      <ReloadOnSignOut to={home} />
      {children}
    </ClerkProvider>
  );
}

// Clerk signs out with a client-side navigation, and Next.js keeps the routes
// visited before it mounted but hidden, private pages included. A full page
// load when the session ends drops them.
function ReloadOnSignOut({ to }: { to: string }) {
  const { isSignedIn } = useAuth();
  const wasSignedIn = useRef(false);

  useEffect(() => {
    // undefined while Clerk loads or switches session: not a sign-out yet.
    if (isSignedIn === undefined) return;
    if (wasSignedIn.current && !isSignedIn) window.location.assign(to);
    wasSignedIn.current = isSignedIn;
  }, [isSignedIn, to]);

  return null;
}
