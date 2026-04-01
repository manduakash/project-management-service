import express from "express";
import AttendanceController from "../controllers/attendance_controller.js";
import authorize from "../middleware/authorization_middleware.js";

const router = express.Router();

router.get("/", AttendanceController.getDailyAttendance);
router.get("/get-monthly-report", AttendanceController.getMonthlyAttendanceReport);
router.get("/export-monthly-report", AttendanceController.exportMonthlyAttendanceReport);
router.post("/update-daily-attendance", AttendanceController.updateDailyAttendance);
router.get("/employee-report", authorize([1, 5]), AttendanceController.getEmployeeAttendanceReport);
router.get("/daily-log-admin", authorize([1]), AttendanceController.getDailyAttendanceLogForAdmin);
router.get("/today-attendance-employee-list", authorize([1, 5]), AttendanceController.getTodayAttendanceEmployeeList);
router.post("/leave-application", authorize([2, 3, 4]), AttendanceController.saveLeaveApplication);
router.post("/merge-leave", authorize([1, 2, 3, 4, 5]), AttendanceController.mergeLeaveDetails);

export default router;
