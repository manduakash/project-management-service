import pool from "../config/db.js";

class AttendanceModel {
    static async updateDailyAttendance(user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_updateDailyAttendance(?,?,?,?,?,?,?,?, @ErrorCode)",
                [user_id, date, check_in, check_out, status_id, work_location_id, remarks, exec_user_id]
            );

            const [[{ ErrorCode }]] = await connection.query(
                "SELECT @ErrorCode AS ErrorCode"
            );

            return ErrorCode;
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

    static async getEmployeeAttendanceReport(userId, fromDate, toDate) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getEmployeeAttendenceReport(?,?,?)",
                [userId, fromDate, toDate]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async getDailyAttendanceLogForAdmin(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDailyAttendenceLogForAdmin(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async getTodayAttendanceEmployeeList(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getTodayAttendenceEmployeeList(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async save_leave_application(leaveTypeId, leaveFrom, leaveTo, description, entryUserId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_saveUserLeaveApplication(?, ?, ?, ?, ?, @ErrorCode)",
                [leaveTypeId, leaveFrom, leaveTo, description, entryUserId]
            );

            const [[{ ErrorCode }]] = await connection.query(
                "SELECT @ErrorCode AS ErrorCode"
            );

            return ErrorCode;
        } finally {
            connection.release();
        }
    }

    static async merge_leave_details(leaveTypeId, leaveFrom, leaveTo, description, entryUserId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_mergeExistingLeaveDetails(?, ?, ?, ?, ?, @ErrorCode)",
                [leaveTypeId, leaveFrom, leaveTo, description, entryUserId]
            );

            const [[{ ErrorCode }]] = await connection.query(
                "SELECT @ErrorCode AS ErrorCode"
            );

            return ErrorCode;
        } finally {
            connection.release();
        }
    }
}

export default AttendanceModel;
