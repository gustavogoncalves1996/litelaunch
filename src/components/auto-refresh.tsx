"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Re-renders the current page on the server every few seconds, for a limited
// time. Render it only while the page is waiting for something to change.
export function AutoRefresh({ everyMs = 3000, times = 10 }) {
  const router = useRouter();

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      router.refresh();
      if (++count >= times) clearInterval(timer);
    }, everyMs);

    return () => clearInterval(timer);
  }, [router, everyMs, times]);

  return null;
}
