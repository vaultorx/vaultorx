import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const quickActions = [
      {
        id: "deposit",
        title: "Deposit",
        description: "Add funds to your vault",
        icon: "Upload",
        href: "/dashboard/deposit",
        color: "blue",
        enabled: true,
      },
      {
        id: "withdraw",
        title: "Withdraw",
        description: "Transfer to external wallet",
        icon: "Download",
        href: "/dashboard/withdraw",
        color: "green",
        enabled: true,
      },
      {
        id: "mint",
        title: "Mint NFT",
        description: "Sell your NFTs",
        icon: "Plus",
        href: "/dashboard/create",
        color: "purple",
        enabled: true,
      },
      {
        id: "create-auction",
        title: "Create Auction",
        description: "Start a timed auction",
        icon: "Ticket",
        href: "/auctions?action=create",
        color: "orange",
        enabled: true,
      },
    ];

    return NextResponse.json({
      data: quickActions,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quick actions", success: false },
      { status: 500 }
    );
  }
}
