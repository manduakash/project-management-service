import AttendanceModel from "../models/attendance_model.js";

class AttendanceService {
  static async updateDailyAttendance(user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id) {
    return await AttendanceModel.updateDailyAttendance(user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id);
  }

  static async getDailyAttendance(date) {
    return await AttendanceModel.getDailyAttendance(date);
  }

  static async getMonthlyAttendanceReport(month, year) {
    return await AttendanceModel.getMonthlyAttendanceReport(month, year);
  }

  static async getEmployeeAttendanceReport(userId, fromDate, toDate) {
    return await AttendanceModel.getEmployeeAttendanceReport(userId, fromDate, toDate);
  }

  static async getDailyAttendanceLogForAdmin(userId) {
    return await AttendanceModel.getDailyAttendanceLogForAdmin(userId);
  }

  static async getTodayAttendanceEmployeeList(userId) {
    return await AttendanceModel.getTodayAttendanceEmployeeList(userId);
  }

  static async saveLeaveApplication(leaveData) {
    const { leaveTypeId, leaveFrom, leaveTo, description, entryUserId } = leaveData;
    return await AttendanceModel.save_leave_application(leaveTypeId, leaveFrom, leaveTo, description, entryUserId);
  }

  static async mergeLeaveDetails(leaveData) {
    const { leaveTypeId, leaveFrom, leaveTo, description, entryUserId } = leaveData;
    return await AttendanceModel.merge_leave_details(leaveTypeId, leaveFrom, leaveTo, description, entryUserId);
  }
}

export default AttendanceService;
