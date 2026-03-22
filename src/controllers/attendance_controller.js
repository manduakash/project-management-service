import AttendanceService from "../services/attendance_service.js";

class AttendanceController {
  static async updateDailyAttendance(req, res) {
    try {
      const { user_id, date, check_in, status_id, work_location_id, remarks } = req.body;
      const exec_user_id = req.user.UserID;

      const errorCode = await AttendanceService.updateDailyAttendance(user_id, date, check_in, "", status_id, work_location_id, remarks, exec_user_id);

      if (errorCode === 0) {
        return res.status(200).json({
          status: "success",
          message: "Attendance Details updated successfully",
        });
      } else if (errorCode > 0) {
        return res.status(404).json({
          status: "failed",
          message: "Failed to update",
        });
      } else {
        return res.status(500).json({
          status: "failed",
          message: "Failed to update notification status",
          errorCode: errorCode,
        });
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  }

  static async getDailyAttendance(req, res) {
    try {
      const { date } = req.body;

      if (!date) {
        return res.status(400).json({
          status: "failed",
          message: "Please ",
        });
      }

      const attendanceLogs = await AttendanceService.getDailyAttendance(date);

      return res.status(200).json({
        status: "success",
        data: attendanceLogs,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  }
}

export default AttendanceController;
