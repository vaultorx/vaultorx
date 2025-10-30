"use server";

import { randomBytes } from "crypto";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/validations/auth";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function requestPasswordReset(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const validatedFields = ForgotPasswordSchema.safeParse({
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      return "Invalid email address.";
    }

    const { email } = validatedFields.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether user exists
      return "If an account with that email exists, we've sent a reset link.";
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send email
    const emailResult = await sendPasswordResetEmail(email, token);

    if (!emailResult.success) {
      return "Failed to send reset email. Please try again.";
    }

    return "If an account with that email exists, we've sent a reset link.";
  } catch (error) {
    console.error("Password reset request error:", error);
    return "Something went wrong. Please try again.";
  }
}

export async function resetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const token = formData.get("token") as string;

    const validatedFields = ResetPasswordSchema.safeParse({
      token,
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
      return "Invalid fields.";
    }

    const { token: resetToken, password } = validatedFields.data;

    if (!resetToken) {
      return "Invalid reset token.";
    }

    // Find the reset token
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token: resetToken },
    });

    if (!passwordResetToken) {
      return "Invalid or expired reset token.";
    }

    // Check if token has expired
    if (passwordResetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { token: resetToken },
      });
      return "Reset token has expired. Please request a new one.";
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: passwordResetToken.email },
    });

    if (!user) {
      return "User not found.";
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { token: resetToken },
    });

    redirect("/login?message=Password reset successfully");
  } catch (error) {
    console.error("Password reset error:", error);
    return "Something went wrong. Please try again.";
  }
}

export async function validateResetToken(token: string) {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { valid: false, error: "Invalid reset token" };
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return { valid: false, error: "Reset token has expired" };
    }

    return { valid: true, email: resetToken.email };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false, error: "Invalid reset token" };
  }
}
