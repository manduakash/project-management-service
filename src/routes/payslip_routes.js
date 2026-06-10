import express from "express";
import DashboardController from "../controllers/dashboard_controller.js";

const router = express.Router();

router.get('/slip', DashboardController.generateSalarySlip);

export default router;
