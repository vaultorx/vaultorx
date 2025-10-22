import { NextRequest, NextResponse } from "next/server";
import AdminJS, { AdminJSOptions } from "adminjs";
import { Database, Resource } from "@adminjs/prisma";
import AdminJSExpress from "@adminjs/express";
import { PrismaClient } from "@prisma/client";
import Connect from "connect-pg-simple";
import session from "express-session";

// Initialize Prisma Client with proper configuration for AdminJS
const prisma = new PrismaClient();

// Register the Prisma adapter
AdminJS.registerAdapter({ Database, Resource });

// Configure AdminJS with proper Prisma model references
const adminOptions: AdminJSOptions = {
  resources: [
    {
      resource: {
        model: prisma.user, // Use lowercase model names from your schema
        client: prisma,
      },
      options: {
        navigation: {
          name: "Database",
          icon: "User",
        },
      },
    },
    // Add more models as needed - use prisma.modelName (lowercase)
  ],
  rootPath: "/api/admin",
  branding: {
    companyName: "My Company",
    logo: false,
    withMadeWithLove: false,
  },
};

const admin = new AdminJS(adminOptions);

// Authentication function
const authenticate = async (email: string, password: string) => {
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return { email };
  }
  return null;
};

// Session store
const ConnectSession = Connect(session);
const sessionStore = new ConnectSession({
  conObject: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production",
  },
  tableName: "session",
  createTableIfMissing: true,
});

// Build authenticated router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword:
      process.env.ADMIN_SESSION_SECRET || "change-this-secret-in-production",
  },
  null,
  {
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret:
      process.env.ADMIN_SESSION_SECRET || "change-this-secret-in-production",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    name: "adminjs",
  }
);

// Convert Express router to Next.js API handler
async function handleRequest(request: NextRequest) {
  const req = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  };

  return new Promise<NextResponse>((resolve, reject) => {
    adminRouter(
      req as any,
      {
        setHeader: () => {},
        end: (data: any) => resolve(new NextResponse(data)),
      } as any,
      (err?: any) => {
        if (err) reject(err);
      }
    );
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

// Recommended: Export config to disable body parsing
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
