import { notFound } from "next/navigation";
import NotFound from "../not-found";

// Every unmatched URL under a locale lands here.
// notFound() is called in generateMetadata instead of the page: the response is
// a real 404 and the localized page is still rendered on the server. Thrown from
// the page, Cache Components would prerender an empty shell filled in by the client.
export function generateMetadata(): never {
  notFound();
}

export default function CatchAllPage() {
  return <NotFound />;
}
