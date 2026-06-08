import FaceAuthService from "../services/face_auth_service.js";
import response from "../utils/response.js";

class FaceAuthController {

    /**
     * POST /api/auth/face/verify
     * form-data: image (file)
     *
     * Same response structure as POST /api/auth/login
     */
    static async verify(req, res) {
        try {
            if (!req.file) return response.error(res, "Image file is required.", 400);

            const meta = {
                latitude: req.body.latitude ?? null,
                longitude: req.body.longitude ?? null,
                ip_address: req.ip || req.headers["x-forwarded-for"] || null,
                device_info: req.headers["user-agent"] ?? null,
            };

            const result = await FaceAuthService.verifyFace(
                req.file.buffer,
                req.file.originalname,
                meta
            );

            return response.success(res, result, "Face verified successfully.", 200);

        } catch (err) {
            const status = err.message.includes("not recognized") ? 401
                : err.message.includes("No face detected") ? 422
                    : err.message.includes("required") ? 400 : 500;
            return response.error(res, err.message, status);
        }
    }

    /**
     * POST /api/auth/face/register
     * form-data: ua_id (text), image (file)
     *
     * Registers/updates face embedding for a user in DB
     */
    static async register(req, res) {
        try {
            if (!req.file) {
                return response.error(res, "Image file is required.", 400);
            }

            const ua_id = parseInt(req.body.ua_id);
            if (!ua_id || isNaN(ua_id) || ua_id <= 0) {
                return response.error(res, "Valid ua_id is required.", 400);
            }

            const result = await FaceAuthService.registerFace(
                ua_id,
                req.file.buffer,
                req.file.originalname
            );

            return response.success(res, null, result.message, 200);

        } catch (err) {
            const status = err.message.includes("required") ? 400
                : err.message.includes("not found") ? 404 : 500;

            return response.error(res, err.message, status);
        }
    }

}

export default FaceAuthController;