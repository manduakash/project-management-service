import express from "express";
import SalaryController from "../controllers/salary_controller.js";

const router = express.Router();

// Base: /api/accountant/salary

// IMPORTANT: /records must be declared BEFORE /:id
// otherwise Express will treat "records" as an :id param

// GET  /api/accountant/salary/records?ua_id=&month=&year=
router.get("/records", SalaryController.getSalaryRecords);

// GET  /api/accountant/salary
router.get("/", SalaryController.getAll);

// GET  /api/accountant/salary/:id
router.get("/:id", SalaryController.getById);

// PUT  /api/accountant/salary/:id
router.post("/", SalaryController.upsert);

export default router;