import express from "express";
import DesignationController from "../controllers/designation_controller.js";

const router = express.Router();

// GET /api/designations
router.get("/", DesignationController.getAll);

export default router;
