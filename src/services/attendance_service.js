import AttendanceModel from "../models/attendance_model.js";

class AttendanceService {
  static async updateDailyAttendance(user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id) {
    return await AttendanceModel.updateDailyAttendance(user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id);
  }

  static async getDailyAttendance(date) {
    return await AttendanceModel.getDailyAttendance(date);
  }
}

export default AttendanceService;
