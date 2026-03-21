import express from "express";
import MasterController from "../controllers/master_controller.js";

const router = express.Router();

// GET /api/master/project-status - list active project statuses
router.get("/project-status", MasterController.getAllProjectStatuses);
// GET /api/master/priority - list active priorities
router.get("/priority", MasterController.getAllPriorities);
// GET /api/master/project-type - list active project types
router.get("/project-type", MasterController.getAllProjectTypes);
// GET /api/master/task-status - list active task statuses
router.get("/task-status", MasterController.getAllTaskStatuses);
// GET /api/master/task-type - list active task types
router.get("/task-type", MasterController.getAllTaskTypes);
// GET /api/master/seniority-levels - list active seniority levels
router.get("/seniority-levels", MasterController.getAllSeniorityLevels);

export default router;
