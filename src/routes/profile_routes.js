import express from "express";
import UserController from "../controllers/user_controller.js";

const router = express.Router();

// PUT /api/users/profile - update user profile (JWT protected)
router.put("/profile", UserController.updateProfile);
// GET /api/users/profile-details - fetch all user profile details (JWT protected)
router.get("/profile-details", UserController.getAllUserProfileDetails);
// DELETE /api/users/remove-user - remove user details (JWT protected)
router.delete("/remove-user", UserController.removeUserDetails);

export default router;
