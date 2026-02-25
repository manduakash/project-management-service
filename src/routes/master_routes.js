import express from "express";
import MasterController from "../controllers/master_controller.js";

const router = express.Router();

// GET /api/master/project-status - list active project statuses
router.get("/project-status", MasterController.getAllProjectStatuses);
// GET /api/master/priority - list active priorities
router.get("/priority", MasterController.getAllPriorities);
// GET /api/master/project-type - list active project types
router.get("/project-type", MasterController.getAllProjectTypes);

export default router;
