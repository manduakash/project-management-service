import express from "express";
import UserController from "../controllers/user_controller.js";
import MasterController from "../controllers/master_controller.js";

const router = express.Router();

// PUT /api/admin/user-profile-update - admin allows updating user profile by ID
router.put("/user-profile-update", UserController.adminUpdateProfile);

// POST /api/admin/save-annual-holiday-details - admin allows saving annual holiday details
router.post("/save-annual-holiday-details", MasterController.saveAnnualHolidayDetails);

export default router;
