import express from "express";
import UserController from "../controllers/user_controller.js";

const router = express.Router();

// PUT /api/users/profile - update user profile (JWT protected)
router.put("/profile", UserController.updateProfile);

export default router;
