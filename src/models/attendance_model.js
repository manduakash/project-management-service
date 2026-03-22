import pool from "../config/db.js";

class AttendanceModel {
    static async updateDailyAttendance(user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id) {
        const connection = await pool.getConnection();
        try {
            const response = await connection.query(
                "CALL sp_updateDailyAttendance(?,?,?,?,?,?,?,?)",
                [user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id]
            );

            console.log(response[0][0][0]);

            return response[0][0][0];
        } finally {
            connection.release();
        }
    }

    static async getDailyAttendance(date) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDailyAttendance(?)",
                [date || ""]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async getMonthlyAttendanceReport(month, year) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getMonthlyAttendanceReport(?,?)",
                [month, year]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }
}

export default AttendanceModel;
