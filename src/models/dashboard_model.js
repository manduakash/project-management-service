import pool from "../config/db.js";

class DashboardModel {
    static async get_dashboard_count(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDashboardCount(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }
    static async get_dashboard_details(userId, fromDate, toDate) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDashboardDetails(?, ?, ?)",
                [userId, fromDate, toDate]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }
}

export default DashboardModel;
