import { PrismaClient, UserRole } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedProduction() {
  // This script should only run in production if explicitly enabled
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_PRODUCTION_SEED !== "true"
  ) {
    console.log("❌ Production seeding is disabled for safety.");
    console.log("   Set ALLOW_PRODUCTION_SEED=true to enable.");
    return;
  }

  console.log("🌱 Starting production seeding...");

  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    throw new Error(
      "SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD environment variables are required for production seeding"
    );
  }

  // Check if superadmin exists
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingSuperAdmin) {
    console.log("✅ SuperAdmin already exists in production");
    return;
  }

  // Create superadmin
  const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      name: process.env.SUPERADMIN_NAME || "Super Administrator",
      password: hashedPassword,
      role: UserRole.SUPERADMIN,
      emailVerified: true,
    },
  });

  console.log("✅ Production SuperAdmin created:");
  console.log("   📧 Email:", superAdmin.email);
  console.log("   🎯 Role:", superAdmin.role);
}

seedProduction()
  .catch((e) => {
    console.error("❌ Production seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
