import express from "express";
import DashboardController from "../controllers/dashboard_controller.js";

const router = express.Router();

// GET /api/developer/dashboard/count (JWT protected)
router.get("/count", DashboardController.getCount);

// GET /api/lead/dashboard/team-member-graph (JWT protected)
router.get("/team-member-graph", DashboardController.getTeamMemberGraphDetails);

// ...existing code...

export default router;
