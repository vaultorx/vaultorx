import AdminJS from "adminjs";
import express from "express";
import AdminJSExpress from '@adminjs/express'
import { Adapter, Database, Resource } from "@adminjs/sql";
import dotenv from "dotenv";
import cors from 'cors';
import Connect from 'connect-pg-simple'
import session from 'express-session'

// Load environment variables
dotenv.config();

AdminJS.registerAdapter({
  Database,
  Resource,
});

const PORT = 3001;

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}


const start = async () => {
  const app = express();
  
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );

  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "Loaded" : "Not found"
  );
  console.log("DATABASE_NAME:", process.env.DATABASE_NAME || "Not found");

  // Create adapter with specific tables only (avoid auto-discovery)
  const db = await new Adapter("postgresql", {
    connectionString: process.env.DATABASE_URL,
    database: process.env.DATABASE_NAME || "vaultorx",
    // Prevent automatic table discovery
  }).init();

  const resources = [];

  // List of tables that have proper primary keys from your schema
  const safeTables = [
    "users",
    "user_notification_settings",
    "platform_wallets",
    "collections",
    "nft_items",
    "transactions",
    "exhibitions",
    "exhibition_collections",
    "exhibition_nfts",
    "exhibition_participations",
    "exhibition_participation_nfts",
    "exhibition_participation_collections",
    "escrow_transactions",
    "withdrawal_requests",
    "whitelisted_addresses",
    "auctions",
    "lottery_tickets",
    "bids",
    "deposit_requests",
    "purchase_sessions",
  ];

  for (const tableName of safeTables) {
    try {
      const resource = db.table(tableName);
      resources.push({
        resource,
        options: {},
      });
      console.log(`✓ Added table: ${tableName}`);
    } catch (error: any) {
      console.warn(`✗ Skipped table: ${tableName} - ${error.message}`);
    }
  }

  const admin = new AdminJS({
    resources: resources,
    rootPath: "/admin",
     branding: {
    companyName: 'AdminJS demo page',
    favicon: '/favicon.ico',
    theme: {
      colors: { primary100: '#4D70EB' },
    },
  },
  });

  // Remove watch() in production or if it causes issues
  if (process.env.NODE_ENV === "development") {
    admin.watch();
  }

  const ConnectSession = Connect(session)
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
  })

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  )

  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    console.log(`Managing ${resources.length} tables`);
  });
};

start().catch(console.error);