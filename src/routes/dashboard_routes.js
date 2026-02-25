import express from "express";
import DashboardController from "../controllers/dashboard_controller.js";

const router = express.Router();

// GET /api/dashboard?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD (JWT protected)
router.get("/counts", DashboardController.get);
router.get("/task-chart", DashboardController.get);
router.get("/project-status-chart", DashboardController.get);
router.get("/urgent-tasks", DashboardController.get);

export default router;
