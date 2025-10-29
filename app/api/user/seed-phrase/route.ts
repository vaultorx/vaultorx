import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SeedPhraseValidator } from "@/lib/utils/seed-validation";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { seedPhrase } = await request.json();

    if (!seedPhrase) {
      return NextResponse.json(
        { success: false, error: "Seed phrase is required" },
        { status: 400 }
      );
    }

    // Try the simple validation method first
    const validation = await SeedPhraseValidator.validateSeedPhraseSimple(
      seedPhrase
    );

    if (!validation.isValid) {
      // Fallback to detailed validation for better error messages
      const detailedValidation = await SeedPhraseValidator.validateSeedPhrase(
        seedPhrase
      );

      if (!detailedValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: detailedValidation.error || "Invalid seed phrase",
          },
          { status: 400 }
        );
      }

      // Use the detailed validation result if simple failed but detailed worked
      validation.isValid = true;
      validation.address = detailedValidation.address;
    }

    // Encrypt the seed phrase before storage
    // const encryptedSeed = await SeedPhraseValidator.encryptSeedPhrase(
    //   seedPhrase,
    //   process.env.SEED_ENCRYPTION_KEY || session.user.id
    // );

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        externalWalletConfigured: true,
        seedPhraseConfiguredAt: new Date(),
        externalWalletSeed: seedPhrase,
      },
      select: {
        id: true,
        email: true,
        externalWalletConfigured: true,
        seedPhraseConfiguredAt: true,
      },
    });

    // Derive multiple addresses to show the user
    const derivedAddresses = SeedPhraseValidator.deriveAddresses(seedPhrase, 1);

    return NextResponse.json({
      success: true,
      data: {
        configured: true,
        derivedAddress: validation.address,
        additionalAddresses: derivedAddresses,
        configuredAt: updatedUser.seedPhraseConfiguredAt,
      },
    });
  } catch (error: any) {
    console.error("Seed phrase configuration error:", error);

    let errorMessage = "Failed to configure seed phrase";
    if (error.message?.includes("invalid mnemonic")) {
      errorMessage =
        "Invalid seed phrase. Please check your words and try again.";
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        externalWalletConfigured: true,
        seedPhraseConfiguredAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        configured: user?.externalWalletConfigured || false,
        configuredAt: user?.seedPhraseConfiguredAt,
      },
    });
  } catch (error) {
    console.error("Seed phrase status fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch seed phrase status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        externalWalletConfigured: false,
        externalWalletSeed: null,
        seedPhraseConfiguredAt: null,
      },
      select: {
        id: true,
        email: true,
        externalWalletConfigured: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        configured: false,
      },
    });
  } catch (error) {
    console.error("Seed phrase removal error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove seed phrase" },
      { status: 500 }
    );
  }
}
