import pool from "../config/db.js";

class FaceAuthModel {

    // Add to FaceAuthModel

    static async logLogin({ ua_id, latitude, longitude, match_score, ip_address, device_info, status, failed_reason }) {
        const connection = await pool.getConnection();
        try {
            await connection.query(`
            INSERT INTO tbl_face_login_logs
              (fll_ua_id, fll_latitude, fll_longitude, fll_match_score,
               fll_ip_address, fll_device_info, fll_status, fll_failed_reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [ua_id, latitude ?? null, longitude ?? null, match_score ?? null,
                ip_address ?? null, device_info ?? null, status, failed_reason ?? null]);
        } finally {
            connection.release();
        }
    }

    /**
     * Fetch all active users with their face embeddings
     * Used for cosine similarity matching
     */
    static async getAllEmbeddings() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT
                    ua_id,
                    ua_full_name,
                    ua_username,
                    ua_email,
                    ua_contact_no,
                    ua_profile_picture,
                    ua_git_username,
                    ua_git_public_key,
                    ua_role_id,
                    ua_face_embedding
                FROM tbl_user_auth
                WHERE ua_isactive = 1
                  AND ua_face_embedding IS NOT NULL
            `);
            return rows;
        } finally {
            connection.release();
        }
    }

    /**
     * Fetch full user details by ua_id (same fields as login SP)
     */
    static async getUserById(ua_id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT
                    ua.ua_id,
                    ua.ua_username,
                    ua.ua_full_name,
                    ua.ua_email,
                    ua.ua_contact_no,
                    ua.ua_profile_picture,
                    ua.ua_git_username,
                    ua.ua_git_public_key,
                    ua.ua_role_id,
                    urm.urm_name AS role_name
                FROM tbl_user_auth ua
                LEFT JOIN tbl_user_role_mstr urm
                    ON urm.urm_id = ua.ua_role_id
                WHERE ua.ua_id = ?
                  AND ua.ua_isactive = 1
                LIMIT 1
            `, [ua_id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    /**
     * Save face embedding for a user (register face)
     */
    static async saveEmbedding(ua_id, embedding) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                UPDATE tbl_user_auth
                SET ua_face_embedding = ?
                WHERE ua_id = ? AND ua_isactive = 1
            `, [JSON.stringify(embedding), ua_id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

}

export default FaceAuthModel;