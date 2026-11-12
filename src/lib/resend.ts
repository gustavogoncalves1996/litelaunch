import "server-only";

import type { ReactElement } from "react";
import { render } from "react-email";
import { Resend } from "resend";

type Email = {
  to: string;
  subject: string;
  template: ReactElement;
  // Resend drops a second send with the same key within 24 hours.
  idempotencyKey?: string;
};

export async function sendEmail({
  to,
  subject,
  template,
  idempotencyKey,
}: Email) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send(
    {
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html: await render(template),
      text: await render(template, { plainText: true }),
    },
    { idempotencyKey },
  );

  if (error) throw new Error(`Resend: ${error.message}`);
}
