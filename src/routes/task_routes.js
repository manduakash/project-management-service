import express from "express";
import TaskController from "../controllers/task_controller.js";

const router = express.Router();

// POST /api/tasks - create or update task (JWT protected)
router.post("/", TaskController.save);
// GET /api/tasks - fetch tasks with optional filters (JWT protected)
router.get("/", TaskController.get);

export default router;
