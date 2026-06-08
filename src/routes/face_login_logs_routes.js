import express from "express";
import FaceLoginLogsController from "../controllers/face_login_logs_controller.js";

const router = express.Router();

// Base: /api/accountant/face-login-logs
// GET /api/accountant/face-login-logs?ua_id=&date_from=&date_to=
router.get("/", FaceLoginLogsController.getLogs);

export default router;