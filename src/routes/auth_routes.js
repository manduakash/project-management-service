import express from "express";
import multer from "multer";
import AuthController from "../controllers/auth_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";
import FaceAuthController from "../controllers/face_auth_controller.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Store image in memory (buffer) — same as the original face-recog project
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, and WEBP images are allowed."));
        }
    }
});

// Verify face → returns token + user (same as login)
router.post("/face/verify", upload.single("image"), FaceAuthController.verify);

// Register face for a user (save embedding to DB)
router.post("/face/register", upload.single("image"), FaceAuthController.register);

// Bulk register users (JWT protected)
router.post("/bulk-register", authMiddleware, AuthController.bulkRegister);

export default router;
