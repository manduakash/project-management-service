import express from "express";
import NotificationController from "../controllers/notification_controller.js";

const router = express.Router();

router.get("/", NotificationController.getUserNotifications);
router.post("/update-seen-status", NotificationController.updateNotificationSeenStatus);

export default router;
