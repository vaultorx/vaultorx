import { PrismaClient, UserRole } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Debug: Check environment variables
  console.log("📋 Environment Check:");
  console.log("   NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "   DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"
  );
  console.log(
    "   SUPERADMIN_EMAIL:",
    process.env.SUPERADMIN_EMAIL || "❌ Not set (using default)"
  );
  console.log(
    "   SUPERADMIN_PASSWORD:",
    process.env.SUPERADMIN_PASSWORD ? "✅ Set" : "❌ Not set (using default)"
  );
  console.log(
    "   SUPERADMIN_NAME:",
    process.env.SUPERADMIN_NAME || "❌ Not set (using default)"
  );
  console.log("");

  // Get superadmin credentials from environment variables with fallbacks
  const superAdminEmail =
    process.env.SUPERADMIN_EMAIL || "superadmin@example.com";
  const superAdminPassword =
    process.env.SUPERADMIN_PASSWORD || "SuperAdmin123!";
  const superAdminName = process.env.SUPERADMIN_NAME || "Super Administrator";

  console.log("🔍 Using credentials:");
  console.log("   Email:", superAdminEmail);
  console.log("   Name:", superAdminName);
  console.log("   Password length:", superAdminPassword.length);
  console.log("");

  // Check database connection
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }

  // Check if superadmin already exists
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingSuperAdmin) {
    console.log("✅ SuperAdmin user already exists:", existingSuperAdmin.email);
    console.log("   👤 Name:", existingSuperAdmin.name);
    console.log("   🎯 Role:", existingSuperAdmin.role);
    console.log("   🆔 ID:", existingSuperAdmin.id);
    return;
  }

  // Validate that we have the required credentials
  if (!superAdminEmail || !superAdminPassword) {
    throw new Error(
      "SuperAdmin email and password must be provided in environment variables"
    );
  }

  // Validate password strength
  if (superAdminPassword.length < 8) {
    throw new Error("SuperAdmin password must be at least 8 characters long");
  }

  console.log("🔐 Hashing password...");
  // Hash the password
  const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
  console.log("✅ Password hashed successfully");

  console.log("👤 Creating SuperAdmin user...");
  // Create superadmin user
  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      name: superAdminName,
      password: hashedPassword,
      role: UserRole.SUPERADMIN,
      emailVerified: new Date(), // Mark as verified
    },
  });

  console.log("✅ SuperAdmin user created successfully:");
  console.log("   📧 Email:", superAdmin.email);
  console.log("   👤 Name:", superAdmin.name);
  console.log("   🎯 Role:", superAdmin.role);
  console.log("   🆔 ID:", superAdmin.id);
  console.log("   📅 Created:", superAdmin.createdAt);

  // Create additional admin users if specified
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!existingAdmin) {
      const adminHashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        12
      );
      const admin = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          name: process.env.ADMIN_NAME || "Administrator",
          password: adminHashedPassword,
          role: UserRole.ADMIN,
          emailVerified: new Date(),
        },
      });
      console.log("✅ Admin user created successfully:");
      console.log("   📧 Email:", admin.email);
      console.log("   👤 Name:", admin.name);
      console.log("   🎯 Role:", admin.role);
    } else {
      console.log("✅ Admin user already exists:", existingAdmin.email);
    }
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
