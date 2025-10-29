import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const participations = await prisma.exhibitionParticipation.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        exhibitionId: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: participations,
    });
  } catch (error) {
    console.error("Error fetching user participations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
