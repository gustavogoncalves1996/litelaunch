import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";

type Props = {
  lang: string;
  preview: string;
  heading: string;
  body: string;
  cta: string;
  url: string;
  footer: string;
};

// Receives its text already translated, so it has no dependency on the app.
export function WelcomeEmail({
  lang,
  preview,
  heading,
  body,
  cta,
  url,
  footer,
}: Props) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{heading}</Heading>
          <Text style={styles.text}>{body}</Text>
          <Button href={url} style={styles.button}>
            {cta}
          </Button>
          <Text style={styles.footer}>{footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f5f5f5",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    margin: "40px auto",
    maxWidth: "480px",
    padding: "32px",
  },
  heading: {
    color: "#171717",
    fontSize: "24px",
    fontWeight: 600,
    margin: "0 0 16px",
  },
  text: {
    color: "#404040",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 24px",
  },
  button: {
    backgroundColor: "#171717",
    borderRadius: "8px",
    color: "#fafafa",
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 16px",
  },
  footer: {
    color: "#737373",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "32px 0 0",
  },
} as const;
