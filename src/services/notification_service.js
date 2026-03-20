import NotificationModel from "../models/notification_model.js";

class NotificationService {
  static async updateNotificationSeenStatus(notificationId) {
    return await NotificationModel.update_notification_seen_status(notificationId);
  }

  static async getUserNotificationDetails(userId) {
    return await NotificationModel.get_user_notification_details(userId);
  }
}

export default NotificationService;
