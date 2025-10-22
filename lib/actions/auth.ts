"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { SignUpSchema, LoginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

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

    // Remove redirect: false and let it throw on error
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: "/dashboard", // Use redirectTo instead
    });

    // This line won't be reached if signIn succeeds (it redirects)
    // and won't be reached if it fails (it throws)
  } catch (error: any) {
    // Check if it's a redirect (successful login)
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error; // Let the redirect happen
    }

    // Handle authentication errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }

    // For any other error
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
      return { error: "Invalid fields." };
    }

    const { name, email, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
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
