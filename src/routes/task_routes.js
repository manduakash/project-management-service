import express from "express";
import TaskController from "../controllers/task_controller.js";

const router = express.Router();

// POST /api/tasks - create or update task (JWT protected)
router.post("/", TaskController.save);
// GET /api/tasks - fetch tasks with optional filters (JWT protected)
router.get("/", TaskController.get);
// GET /api/tasks/assignment-members - fetch members for assignment (JWT protected)
router.get("/assignment-members", TaskController.getAssignmentMembers);
// PATCH /api/tasks/status - update task status, priority, and deadline (JWT protected)
router.patch("/status", TaskController.updateStatus);

export default router;
