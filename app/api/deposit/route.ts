import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { DepositStatus } from "@/lib/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { amount, currency, transactionHash } = await request.json();

    if (!amount || amount <= 0 || !transactionHash) {
      return NextResponse.json(
        { success: false, error: "Amount and transaction hash are required" },
        { status: 400 }
      );
    }

    // Check if transaction hash already exists
    const existingDeposit = await prisma.depositRequest.findUnique({
      where: { transactionHash },
    });

    if (existingDeposit) {
      return NextResponse.json(
        { success: false, error: "Transaction hash already exists" },
        { status: 400 }
      );
    }

    // Create deposit request
    const depositRequest = await prisma.depositRequest.create({
      data: {
        userId: session.user.id,
        amount,
        currency,
        transactionHash,
        status: "pending",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { depositRequest },
    });
  } catch (error) {
    console.error("Deposit creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const where = {
      userId: session.user.id,
      ...(status && { status: status.toUpperCase() as DepositStatus }),
    };

    const [deposits, total] = await Promise.all([
      prisma.depositRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.depositRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        deposits,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Deposit fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
