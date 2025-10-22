import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/validations/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Authorize called with:", { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          const validatedFields = LoginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.log("❌ Validation failed:", validatedFields.error);
            return null;
          }

          const { email, password } = validatedFields.data;

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          console.log(
            "👤 User found:",
            user
              ? { id: user.id, email: user.email, hasPassword: !!user.password }
              : "No user"
          );

          if (!user || !user.password) {
            console.log("❌ User not found or no password");
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log("🔐 Password match:", passwordMatch);

          if (!passwordMatch) {
            console.log("❌ Password doesn't match");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/signout"
    // signUp: "/signup",
  },
});
