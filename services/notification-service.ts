import { EmailService } from "@/lib/emails/email-service";
import prisma from "@/lib/prisma";

export class NotificationService {
  static async sendUserNotification(
    userId: string,
    type: string,
    message: string
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          notificationSettings: true,
        },
      });

      if (!user) {
        console.error(`User not found: ${userId}`);
        return;
      }

      // Check if email notifications are enabled for this type
      const settings = user.notificationSettings;
      if (!settings?.emailNotifications) {
        return; // User has disabled email notifications
      }

      // Check specific notification type preferences
      let shouldSend = false;
      switch (type) {
        case "sale":
          shouldSend = settings.salesAlerts;
          break;
        case "bid":
          shouldSend = settings.bidAlerts;
          break;
        case "exhibition":
          shouldSend = settings.exhibitionUpdates;
          break;
        default:
          shouldSend = true;
      }

      if (shouldSend) {
        await EmailService.sendNotificationEmail(
          user.email,
          type,
          message,
          user.name || undefined
        );
      }
    } catch (error) {
      console.error("Error sending user notification:", error);
    }
  }

  static async notifySale(userId: string, nftName: string, price: number) {
    const message = `Your NFT "${nftName}" has been sold for ${price} ETH.`;
    await this.sendUserNotification(userId, "sale", message);
  }

  static async notifyBid(userId: string, nftName: string, bidAmount: number) {
    const message = `You have received a new bid of ${bidAmount} ETH on your NFT "${nftName}".`;
    await this.sendUserNotification(userId, "bid", message);
  }

  static async notifyExhibitionParticipation(
    userId: string,
    exhibitionTitle: string,
    status: string
  ) {
    const message = `Your participation in "${exhibitionTitle}" has been ${status}.`;
    await this.sendUserNotification(userId, "exhibition", message);
  }

  static async notifyExhibitionApproval(
    userId: string,
    exhibitionTitle: string
  ) {
    const message = `Your exhibition "${exhibitionTitle}" has been approved and is now live.`;
    await this.sendUserNotification(userId, "exhibition", message);
  }
}
