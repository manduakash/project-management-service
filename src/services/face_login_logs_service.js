import FaceLoginLogsModel from "../models/face_login_logs_model.js";

class FaceLoginLogsService {

    static async getLogs(query) {
        const ua_id     = parseInt(query.ua_id ?? 0) || 0;
        const date_from = query.date_from?.trim() || null;
        const date_to   = query.date_to?.trim()   || null;

        // Validate ua_id
        if (isNaN(ua_id) || ua_id < 0)
            throw new Error("Invalid ua_id.");

        // Validate date formats if provided
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (date_from && !dateRegex.test(date_from))
            throw new Error("Invalid date_from format. Use YYYY-MM-DD.");

        if (date_to && !dateRegex.test(date_to))
            throw new Error("Invalid date_to format. Use YYYY-MM-DD.");

        if (date_from && date_to && new Date(date_from) > new Date(date_to))
            throw new Error("date_from cannot be greater than date_to.");

        return await FaceLoginLogsModel.getLogs(
            ua_id || null,
            date_from,
            date_to
        );
    }

}

export default FaceLoginLogsService;