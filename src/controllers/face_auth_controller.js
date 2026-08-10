import FaceAuthService from "../services/face_auth_service.js";
import response from "../utils/response.js";

const OFFICE_LAT = 22.572386;
const OFFICE_LNG = 88.435969;
const ALLOWED_RADIUS_METERS = 50;

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

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
            if (!req?.body?.latitude || !req?.body?.longitude) return response.error(res, "Geographical parameters required.", 400);

            const latitude = parseFloat(req.body.latitude);
            const longitude = parseFloat(req.body.longitude);

            if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
                return response.error(res, "Invalid geographical parameters.", 400);
            }

            const distance = getDistanceInMeters(OFFICE_LAT, OFFICE_LNG, latitude, longitude);

            if (distance > ALLOWED_RADIUS_METERS) {
                return response.error(res, "Check-in is only allowed within 20 meters of the office premises.", 400);
            }

            const meta = {
                latitude,
                longitude,
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