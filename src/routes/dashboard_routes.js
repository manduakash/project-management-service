import express from "express";
import DashboardController from "../controllers/dashboard_controller.js";

const router = express.Router();

// GET /api/developer/dashboard/count (JWT protected)
router.get("/count", DashboardController.getCount);


// GET /api/developer/dashboard/team-member-graph (JWT protected)
router.get("/team-member-graph", DashboardController.getTeamMemberGraphDetails);

// GET /api/developer/dashboard/developer-wise-team-progress-graph (JWT protected)
router.get("/developer-wise-team-progress-graph", DashboardController.getDeveloperWiseTeamProgressGraph);

// ...existing code...

export default router;
