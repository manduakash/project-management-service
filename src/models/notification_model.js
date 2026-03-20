import pool from "../config/db.js";

class NotificationModel {
  static async update_notification_seen_status(notificationId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "CALL sp_updateNotificationSeenStatus(?, @ErrorCode)",
        [notificationId || 0]
      );

      const [[{ ErrorCode }]] = await connection.query(
        "SELECT @ErrorCode AS ErrorCode"
      );

      return ErrorCode;
    } finally {
      connection.release();
    }
  }

  static async get_user_notification_details(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getUserNotificationDetails(?)",
        [userId || 0]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }
}

export default NotificationModel;
