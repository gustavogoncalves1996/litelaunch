"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

// Submit button for a <form action={serverAction}>. Disabled while the action
// runs, so a double click cannot start it twice.
export function SubmitButton(props: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return <Button {...props} type="submit" disabled={pending} />;
}
