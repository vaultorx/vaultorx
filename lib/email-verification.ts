import prisma from "@/lib/prisma";
import crypto from "crypto";

export class EmailVerificationService {
  static async createVerificationToken(email: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Using the existing VerificationToken model with composite key
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
      update: {
        token: token,
        expires: expires,
      },
      create: {
        identifier: email,
        token: token,
        expires: expires,
      },
    });

    return token;
  }

  static async verifyToken(email: string, token: string) {
    const verification = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    if (!verification) {
      return { valid: false, error: "Token not found" };
    }

    if (verification.expires < new Date()) {
      return { valid: false, error: "Token expired" };
    }

    return { valid: true };
  }

  static async deleteToken(email: string, token: string) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });
  }

  static async cleanupExpiredTokens() {
    await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  }
}
