import FaceLoginLogsService from "../services/face_login_logs_service.js";
import response from "../utils/response.js";

class FaceLoginLogsController {

    /**
     * GET /api/accountant/face-login-logs
     * Query params:
     *   ?ua_id=3               → specific user
     *   ?ua_id=0               → all users (default)
     *   ?date_from=2026-01-01  → from date (inclusive)
     *   ?date_to=2026-06-08    → to date   (inclusive)
     *   All params optional — omit all to get everything
     */
    static async getLogs(req, res) {
        try {
            const data = await FaceLoginLogsService.getLogs(req.query);
            return response.success(res, data, "Face login logs fetched successfully.", 200);
        } catch (err) {
            const status = err.message.includes("Invalid") ? 400
                         : err.message.includes("cannot be greater") ? 422 : 500;
            return response.error(res, err.message, status);
        }
    }

}

export default FaceLoginLogsController;