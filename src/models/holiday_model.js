import pool from "../config/db.js";

class HolidayModel {

    static async getAll(month, year) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_holiday_get_all(?, ?)",
                [month, year]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_holiday_get_by_id(?)",
                [id]
            );
            return rows[0]?.[0] || null;
        } finally {
            connection.release();
        }
    }

    static async insert(hm_name, hm_date) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_holiday_insert(?, ?, @p_new_id, @p_message)",
                [hm_name, hm_date]
            );
            const [[result]] = await connection.query(
                "SELECT @p_new_id AS new_id, @p_message AS message"
            );
            return result;
        } finally {
            connection.release();
        }
    }

    static async update(id, hm_name, hm_date) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_holiday_update(?, ?, ?, @p_message)",
                [id, hm_name, hm_date]
            );
            const [[result]] = await connection.query(
                "SELECT @p_message AS message"
            );
            return result.message;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "CALL sp_holiday_delete(?, @p_message)",
                [id]
            );
            const [[result]] = await connection.query(
                "SELECT @p_message AS message"
            );
            return result.message;
        } finally {
            connection.release();
        }
    }

}

export default HolidayModel;