import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { auth } from "@/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    const { sessionId, transactionHash } = await request.json();

    if (!sessionId || !transactionHash) {
      return NextResponse.json(
        {
          error: "Session ID and transaction hash are required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Get purchase session
    const purchaseSession = await prisma.purchaseSession.findUnique({
      where: { id: sessionId },
      include: {
        nftItem: {
          include: {
            collection: true,
            owner: true,
          },
        },
        user: true,
      },
    });

    if (!purchaseSession || purchaseSession.userId !== user.id) {
      return NextResponse.json(
        { error: "Purchase session not found", success: false },
        { status: 404 }
      );
    }

    if (purchaseSession.status !== "pending") {
      return NextResponse.json(
        { error: "Purchase session is not in pending state", success: false },
        { status: 400 }
      );
    }

    if (new Date() > new Date(purchaseSession.expiresAt)) {
      // Update session status to expired
      await prisma.purchaseSession.update({
        where: { id: sessionId },
        data: { status: "expired" },
      });

      return NextResponse.json(
        { error: "Purchase session has expired", success: false },
        { status: 400 }
      );
    }

    // Update purchase session with transaction hash and mark as processing
    const updatedSession = await prisma.purchaseSession.update({
      where: { id: sessionId },
      data: {
        transactionHash: transactionHash,
        status: "processing",
      },
      include: {
        nftItem: {
          include: {
            collection: true,
            owner: true,
          },
        },
        user: true,
      },
    });

    // Send email notification to admin
    await sendAdminNotification(updatedSession);

    return NextResponse.json({
      data: updatedSession,
      success: true,
      message:
        "Transaction submitted successfully. Admin will process your purchase.",
    });
  } catch (error) {
    console.error("Transaction confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm transaction", success: false },
      { status: 500 }
    );
  }
}

async function sendAdminNotification(purchaseSession: any) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nftplatform.com";

    await resend.emails.send({
      from: "nft-platform@resend.dev",
      to: adminEmail,
      subject: `New NFT Purchase Requires Approval - ${purchaseSession.nftItem.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New NFT Purchase Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Purchase Details</h3>
            <p><strong>NFT:</strong> ${purchaseSession.nftItem.name}</p>
            <p><strong>Collection:</strong> ${
              purchaseSession.nftItem.collection.name
            }</p>
            <p><strong>Buyer:</strong> ${purchaseSession.user.email} (${
        purchaseSession.user.name || "N/A"
      })</p>
            <p><strong>Amount:</strong> ${purchaseSession.amount} ${
        purchaseSession.currency
      }</p>
            <p><strong>Transaction Hash:</strong> ${
              purchaseSession.transactionHash
            }</p>
            <p><strong>Session ID:</strong> ${purchaseSession.id}</p>
          </div>

          <div style="margin: 20px 0;">
            <p>Please verify the transaction and process the NFT transfer.</p>
            <a href="${process.env.NEXTAUTH_URL}/admin/purchases/${
        purchaseSession.id
      }" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Review Purchase
            </a>
          </div>

          <p style="color: #666; font-size: 12px;">
            This is an automated notification from the NFT Platform.
          </p>
        </div>
      `,
    });

    // Mark as notified
    await prisma.purchaseSession.update({
      where: { id: purchaseSession.id },
      data: { adminNotified: true },
    });

    console.log("Admin notification sent successfully");
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}
