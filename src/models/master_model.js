import pool from "../config/db.js";

class MasterModel {
    static async get_all_project_statuses() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllProjectStatusDetails()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_all_priorities() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllPriorityDetails()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_all_project_types() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllProjectTypeDetails()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }
    static async get_all_task_statuses() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllTaskStatusDetails()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_all_task_types() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllTaskTypeDetails()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_all_seniority_levels() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllSeniorityLevels()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_all_organization_details() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAllOrganizationDetails()"
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_annual_holiday_list(userId, year) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getAnnualHolidayList(?,?)",
                [userId || 0, year]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async save_annual_holiday_details(year, date, description, entryUserId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_saveAnnualHolidayDetails(?,?,?,?, @ErrorCode)",
                [year, date, description, entryUserId]
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

export default MasterModel;
