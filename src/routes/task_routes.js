import express from "express";
import TaskController from "../controllers/task_controller.js";

const router = express.Router();

// POST /api/tasks - create or update task (JWT protected)
router.post("/", TaskController.saveTaskDetails);
// GET /api/tasks - fetch tasks with optional filters (JWT protected)
router.get("/", TaskController.get);
// GET /api/tasks/assignment-members - fetch members for assignment (JWT protected)
router.get("/assignment-members", TaskController.getAssignmentMembers);
// PATCH /api/tasks/status - update task status, priority, and deadline (JWT protected)
router.patch("/status", TaskController.updateStatus);
// GET /api/tasks/available-developers - fetch available developers for task assignment (JWT protected)
router.get("/available-developers", TaskController.getAvailableDevelopers);
// GET /api/tasks/my-tasks - fetch task details for the logged-in developer (JWT protected)
router.get("/my-tasks", TaskController.getTaskDetailsByUserId);
// DELETE /api/tasks - remove task (JWT protected)
router.delete("/", TaskController.remove);

export default router;
