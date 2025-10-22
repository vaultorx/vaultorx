import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetLink: string;
}

export default function ResetPasswordEmail({
  resetLink,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-5">
            <Section className="mt-8">
              <Heading className="text-2xl font-semibold text-gray-900">
                Reset Your Password
              </Heading>
              <Text className="text-lg text-gray-700">
                Click the button below to reset your password. This link will
                expire in 1 hour.
              </Text>
              <Section className="text-center mt-6 mb-6">
                <Button
                  className="bg-indigo-600 rounded-md text-white font-medium py-3 px-6"
                  href={resetLink}
                >
                  Reset Password
                </Button>
              </Section>
              <Text className="text-sm text-gray-600">
                If you didn't request this email, you can safely ignore it.
              </Text>
              <Hr className="border-gray-300 mt-8" />
              <Text className="text-xs text-gray-500">
                If the button doesn't work, copy and paste this link into your
                browser: {resetLink}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
