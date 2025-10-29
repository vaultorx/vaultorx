import { Resend } from "resend";
import { emailTemplates } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendVerificationEmail(
    email: string,
    verificationToken: string,
    userName?: string
  ) {
    try {
      const verificationLink = `${process.env.NEXTAUTH_URL}/api/user/verify-email?token=${verificationToken}`;
      const template = emailTemplates.verification(verificationLink, userName);

      const { data, error } = await resend.emails.send({
        from: "Vaultorx <noreply@vaultorx.com>",
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error };
    }
  }

  static async sendTwoFactorEmail(
    email: string,
    enabled: boolean,
    userName?: string
  ) {
    try {
      const template = enabled
        ? emailTemplates.twoFactorSetup(userName)
        : emailTemplates.twoFactorDisabled(userName);

      const { data, error } = await resend.emails.send({
        from: "Vaultorx Security <security@vaultorx.com>",
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Error sending 2FA email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error sending 2FA email:", error);
      return { success: false, error };
    }
  }

  static async sendNotificationEmail(
    email: string,
    type: string,
    message: string,
    userName?: string
  ) {
    try {
      const template = emailTemplates.notificationAlert(
        type,
        message,
        userName
      );

      const { data, error } = await resend.emails.send({
        from: "Vaultorx Notifications <notifications@vaultorx.com>",
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Error sending notification email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error sending notification email:", error);
      return { success: false, error };
    }
  }

  static async sendWelcomeEmail(email: string, userName?: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: "Vaultorx <welcome@vaultorx.com>",
        to: email,
        subject: "Welcome to Vaultorx!",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
                .content { padding: 30px; background: #f9f9f9; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Vaultorx!</h1>
                  <p>Your NFT Marketplace Journey Begins</p>
                </div>
                <div class="content">
                  <p>Hello ${userName || "there"},</p>
                  <p>Welcome to Vaultorx! We're excited to have you join our community of NFT enthusiasts, creators, and collectors.</p>
                  <p>Get started by:</p>
                  <ul>
                    <li>Exploring featured exhibitions</li>
                    <li>Creating your first collection</li>
                    <li>Participating in community events</li>
                    <li>Discovering unique digital artworks</li>
                  </ul>
                  <p>If you have any questions, feel free to reach out to our support team.</p>
                </div>
                <div class="footer">
                  <p>&copy; 2024 Vaultorx. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }
  }

  static async sendWithdrawalVerificationEmail(
    email: string,
    verificationCode: string,
    userName?: string
  ) {
    try {
      const template = emailTemplates.withdrawalVerification(
        verificationCode,
        userName
      );

      const { data, error } = await resend.emails.send({
        from: "Vaultorx Security <security@vaultorx.com>",
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Error sending withdrawal verification email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error sending withdrawal verification email:", error);
      return { success: false, error };
    }
  }

  static async sendWithdrawalConfirmationEmail(
    email: string,
    amount: number,
    currency: string,
    destinationAddress: string,
    userName?: string
  ) {
    try {
      const template = emailTemplates.withdrawalCompleted(
        amount,
        currency,
        destinationAddress,
        userName
      );

      const { data, error } = await resend.emails.send({
        from: "Vaultorx <withdrawals@vaultorx.com>",
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Error sending withdrawal confirmation email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error sending withdrawal confirmation email:", error);
      return { success: false, error };
    }
  }
}
