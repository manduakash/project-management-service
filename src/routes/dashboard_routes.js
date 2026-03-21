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

// GET /api/admin/dashboard/project-wise-progress-graph (JWT protected)
router.get("/project-wise-progress-graph", DashboardController.getProjectWiseProgressForAdmin);
// GET /api/admin/dashboard/team-lead-status (JWT protected)
router.get("/team-lead-status", DashboardController.getTeamLeadStatusForAdmin);

// ...existing code...

export default router;
