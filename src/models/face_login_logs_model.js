import pool from "../config/db.js";

class FaceLoginLogsModel {

    static async getLogs(ua_id, date_from, date_to) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_face_login_logs_get(?, ?, ?)",
                [ua_id, date_from, date_to]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

}

export default FaceLoginLogsModel;