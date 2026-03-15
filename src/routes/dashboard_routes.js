import express from "express";
import DashboardController from "../controllers/dashboard_controller.js";

const router = express.Router();

// GET /api/developer/dashboard/count (JWT protected)
router.get("/count", DashboardController.getCount);


// GET /api/developer/dashboard/team-member-graph (JWT protected)
router.get("/team-member-graph", DashboardController.getTeamMemberGraphDetails);

// GET /api/developer/dashboard/developer-wise-team-progress-graph (JWT protected)
router.get("/developer-wise-team-progress-graph", DashboardController.getDeveloperWiseTeamProgressGraph);

// GET /api/lead/dashboard/weekly-task-progress-graph (JWT protected)
router.get("/weekly-task-progress-graph", DashboardController.getDashboardWeeklyTaskProgressGraph);

// GET /api/lead/dashboard/deadline-crossed or /api/developer/dashboard/deadline-crossed (JWT protected)
router.get("/deadline-crossed", DashboardController.getDeveloperDashboardDeadlineCrossedDetails);

// ...existing code...

export default router;
