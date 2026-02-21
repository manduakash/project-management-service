import express from "express";
import TaskController from "../controllers/task_controller.js";

const router = express.Router();

// POST /api/tasks - create or update task (JWT protected)
router.post("/", TaskController.save);

export default router;
