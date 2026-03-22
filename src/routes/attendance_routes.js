import express from "express";
import AttendanceController from "../controllers/attendance_controller.js";

const router = express.Router();

router.get("/", AttendanceController.getDailyAttendance);
router.get("/get-monthly-report", AttendanceController.getMonthlyAttendanceReport);
router.get("/export-monthly-report", AttendanceController.exportMonthlyAttendanceReport);
router.post("/update-daily-attendance", AttendanceController.updateDailyAttendance);

export default router;
