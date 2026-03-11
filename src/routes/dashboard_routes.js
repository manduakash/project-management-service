import express from "express";
import DashboardController from "../controllers/dashboard_controller.js";

const router = express.Router();

// GET /api/developer/dashboard/count (JWT protected)
router.get("/count", DashboardController.getCount);

// ...existing code...

export default router;
