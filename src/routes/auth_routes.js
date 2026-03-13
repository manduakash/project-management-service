import express from "express";
import AuthController from "../controllers/auth_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// Bulk register users (JWT protected)
router.post("/bulk-register", authMiddleware, AuthController.bulkRegister);

export default router;
