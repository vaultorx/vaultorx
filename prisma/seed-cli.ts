import { PrismaClient, UserRole } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createSuperAdmin() {
  console.log("🚀 SuperAdmin Seeder CLI");
  console.log("=======================\n");

  // Check for existing superadmin
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: UserRole.SUPERADMIN },
  });

  if (existingSuperAdmin) {
    console.log("⚠️  A SuperAdmin user already exists:");
    console.log(`   📧 Email: ${existingSuperAdmin.email}`);
    console.log(`   👤 Name: ${existingSuperAdmin.name}`);
    console.log(`   🎯 Role: ${existingSuperAdmin.role}`);

    const overwrite = await question(
      "\nDo you want to create another SuperAdmin? (y/N): "
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Seeding cancelled.");
      rl.close();
      return;
    }
  }

  // Get user input
  const email = await question("Enter SuperAdmin email: ");
  const name = await question("Enter SuperAdmin name: ");
  const password = await question("Enter SuperAdmin password: ");
  const confirmPassword = await question("Confirm SuperAdmin password: ");

  // Validate input
  if (!email || !name || !password) {
    console.log("❌ All fields are required!");
    rl.close();
    return;
  }

  if (password !== confirmPassword) {
    console.log("❌ Passwords do not match!");
    rl.close();
    return;
  }

  if (password.length < 8) {
    console.log("❌ Password must be at least 8 characters long!");
    rl.close();
    return;
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`❌ User with email ${email} already exists!`);
    rl.close();
    return;
  }

  // Create superadmin
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const superAdmin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.SUPERADMIN,
        emailVerified: true,
      },
    });

    console.log("\n✅ SuperAdmin created successfully!");
    console.log("   📧 Email:", superAdmin.email);
    console.log("   👤 Name:", superAdmin.name);
    console.log("   🎯 Role:", superAdmin.role);
    console.log("   🆔 ID:", superAdmin.id);
  } catch (error) {
    console.log("❌ Error creating SuperAdmin:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createSuperAdmin();
