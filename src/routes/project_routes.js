import express from "express";
import ProjectController from "../controllers/project_controller.js";
import authorize from "../middleware/authorization_middleware.js";

const router = express.Router();

// POST /api/projects  - create or update project via sp_saveProjectDetails
router.post("/", ProjectController.save);
// GET /api/projects - list projects
router.get("/", ProjectController.getAll);
// GET /api/projects/my-projects - list projects by logged-in user (JWT protected)
router.get("/projects-by-user-id", ProjectController.getByUser);
// GET /api/projects/available-developers - list available developers for project assignment (JWT protected)
router.get("/available-developers", ProjectController.getAvailableDevelopers);
// POST /api/projects/assign-user - assign a user to a project (JWT protected)
router.post("/assign-user", ProjectController.assignUser);

// POST /api/projects/assign-project-lead-by-admin - assign a lead to a project (Admin only)
router.post("/assign-project-lead-by-admin", authorize([1]), ProjectController.assignProjectLeadByAdmin);

// POST /api/projects/deassign-team-lead-for-admin - deassign a lead from a project (Admin only)
router.post("/deassign-team-lead-for-admin", authorize([1]), ProjectController.deassignTeamLeadByAdmin);

export default router;
