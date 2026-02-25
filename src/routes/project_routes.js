import express from "express";
import ProjectController from "../controllers/project_controller.js";

const router = express.Router();

// POST /api/projects  - create or update project via sp_saveProjectDetails
router.post("/", ProjectController.save);
// GET /api/projects - list projects
router.get("/", ProjectController.getAll);
// GET /api/projects/my-projects - list projects by logged-in user (JWT protected)
router.get("/projects-by-user-id", ProjectController.getByUser);

export default router;
