// ─── Week Offs ───────────────────────────────────────────────
import express from "express";
import WeekOffController from "../controllers/weekoff_controller.js";

const weekOffRouter = express.Router();

// Base: /api/accountant/weekoffs
weekOffRouter.get("/", WeekOffController.getAll);
weekOffRouter.get("/:id", WeekOffController.getById);
weekOffRouter.post("/", WeekOffController.insert);
weekOffRouter.put("/:id", WeekOffController.update);
weekOffRouter.delete("/:id", WeekOffController.delete);

export default weekOffRouter;