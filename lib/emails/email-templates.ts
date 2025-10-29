const year = new Date().getFullYear();

export const emailTemplates = {
  verification: (verificationLink: string, userName?: string) => ({
    subject: "Verify Your Email Address - Vaultorx",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vaultorx</h1>
              <p>NFT Marketplace Platform</p>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Hello ${userName || "there"},</p>
              <p>Welcome to Vaultorx! Please verify your email address to complete your account setup and start exploring our NFT marketplace.</p>
              <p>Click the button below to verify your email address:</p>
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${verificationLink}">${verificationLink}</a></p>
              <p>This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account with Vaultorx, please ignore this email.</p>
              <p>&copy; ${year} Vaultorx. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  twoFactorSetup: (userName?: string) => ({
    subject: "Two-Factor Authentication Enabled - Vaultorx",
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
              <h1>Vaultorx</h1>
              <p>Security Notification</p>
            </div>
            <div class="content">
              <h2>Two-Factor Authentication Enabled</h2>
              <p>Hello ${userName || "there"},</p>
              <p>Two-factor authentication has been successfully enabled for your Vaultorx account.</p>
              <p>This adds an extra layer of security to your account. From now on, you'll need both your password and an authentication code to sign in.</p>
              <p><strong>If you did not enable two-factor authentication, please contact our support team immediately.</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${year} Vaultorx. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  twoFactorDisabled: (userName?: string) => ({
    subject: "Two-Factor Authentication Disabled - Vaultorx",
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
              <h1>Vaultorx</h1>
              <p>Security Notification</p>
            </div>
            <div class="content">
              <h2>Two-Factor Authentication Disabled</h2>
              <p>Hello ${userName || "there"},</p>
              <p>Two-factor authentication has been disabled for your Vaultorx account.</p>
              <p>Your account is now protected only by your password. For enhanced security, we recommend keeping two-factor authentication enabled.</p>
              <p><strong>If you did not disable two-factor authentication, please contact our support team immediately.</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${year} Vaultorx. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  notificationAlert: (type: string, message: string, userName?: string) => ({
    subject: `Notification: ${type} - Vaultorx`,
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
              <h1>Vaultorx</h1>
              <p>Notification Center</p>
            </div>
            <div class="content">
              <h2>${type}</h2>
              <p>Hello ${userName || "there"},</p>
              <p>${message}</p>
              <p>You can manage your notification preferences in your account settings.</p>
            </div>
            <div class="footer">
              <p>&copy; ${year} Vaultorx. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  withdrawalVerification: (verificationCode: string, userName?: string) => ({
    subject: "Withdrawal Verification Code - Vaultorx",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9f9f9; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; margin: 30px 0; padding: 20px; background: #fff; border: 2px dashed #667eea; border-radius: 8px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vaultorx</h1>
              <p>Security Verification</p>
            </div>
            <div class="content">
              <h2>Withdrawal Verification Code</h2>
              <p>Hello ${userName || "there"},</p>
              <p>You've requested to withdraw funds from your Vaultorx account. Please use the following verification code to complete your withdrawal:</p>
              
              <div class="code">${verificationCode}</div>
              
              <div class="warning">
                <strong>Security Notice:</strong>
                <ul>
                  <li>This code will expire in 10 minutes</li>
                  <li>Never share this code with anyone</li>
                  <li>Vaultorx staff will never ask for this code</li>
                </ul>
              </div>
              
              <p>If you didn't request this withdrawal, please secure your account immediately by changing your password and contacting our support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated security message. Please do not reply to this email.</p>
              <p>&copy; ${year} Vaultorx. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  withdrawalCompleted: (
    amount: number,
    currency: string,
    destinationAddress: string,
    userName?: string
  ) => ({
    subject: "Withdrawal Completed - Vaultorx",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9f9f9; }
            .details { background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vaultorx</h1>
              <p>Withdrawal Confirmation</p>
            </div>
            <div class="content">
              <h2>Withdrawal Successfully Processed</h2>
              <p>Hello ${userName || "there"},</p>
              <p>Your withdrawal request has been successfully processed.</p>
              
              <div class="details">
                <h3>Transaction Details:</h3>
                <p><strong>Amount:</strong> ${amount} ${currency}</p>
                <p><strong>Destination:</strong> ${destinationAddress.slice(
                  0,
                  10
                )}...${destinationAddress.slice(-8)}</p>
                <p><strong>Status:</strong> Completed</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p>The funds should arrive in your external wallet within the next few minutes. If you don't see the transaction after 15 minutes, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${year} Vaultorx. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
