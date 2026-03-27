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

export default router;
