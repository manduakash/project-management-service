import NotificationService from "../services/notification_service.js";

class NotificationController {
  static async updateNotificationSeenStatus(req, res) {
    try {
      const { NotificationID } = req.body;

      if (!NotificationID) {
        return res.status(400).json({
          status: "failed",
          message: "NotificationID is required",
        });
      }

      const errorCode = await NotificationService.updateNotificationSeenStatus(NotificationID);

      if (errorCode === 0) {
        return res.status(200).json({
          status: "success",
          message: "Notification status updated successfully",
        });
      } else if (errorCode > 0) {
        return res.status(404).json({
          status: "failed",
          message: "Notification not found",
        });
      } else {
        return res.status(500).json({
          status: "failed",
          message: "Failed to update notification status",
          errorCode: errorCode,
        });
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  }

  static async getUserNotifications(req, res) {
    try {
      const userId = req.user.UserID;

      if (!userId) {
        return res.status(401).json({
          status: "failed",
          message: "User not authenticated",
        });
      }

      const notifications = await NotificationService.getUserNotificationDetails(userId);

      return res.status(200).json({
        status: "success",
        data: notifications,
      });
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  }
}

export default NotificationController;
