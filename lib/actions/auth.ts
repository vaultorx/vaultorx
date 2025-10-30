"use server";

import { signIn, signOut } from "@/auth";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { SignUpSchema, LoginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import { WalletService } from "@/lib/services/wallet-service";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const validatedFields = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return "Invalid fields.";
    }

    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }

    return "Something went wrong.";
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const validatedFields = SignUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return {
        error: "Validation failed",
        details: errors,
      };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        walletBalance: 0,
      },
    });

    // Assign wallet to user
    let walletAssignment;
    try {
      walletAssignment = await WalletService.assignWalletToUser(user.id);
    } catch (walletError) {
      console.error("Wallet assignment failed:", walletError);
      // If wallet assignment fails, we still create the user but log the error
      // You might want to handle this differently based on your requirements
      return {
        success: true,
        message:
          "Account created successfully, but wallet assignment failed. Please contact support.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          assignedWallet: null,
        },
      };
    }

    // Get the complete user with wallet info
    const userWithWallet = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        assignedWallet: true,
        walletAssignedAt: true,
        walletBalance: true,
      },
    });

    return {
      success: true,
      message: `Account created successfully! Your assigned wallet: ${userWithWallet?.assignedWallet}`,
      user: userWithWallet,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
