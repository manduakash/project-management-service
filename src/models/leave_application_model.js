import pool from '../config/db.js';

export class LeaveApplicationModel {

    static async getAll({ user_id, month, year }) {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                `CALL sp_leave_application_getall(?, ?, ?)`,
                [user_id || 0, month || 0, year || 0]
            );
            return rows[0];
        } finally {
            conn.release();
        }
    }

    static async update(ulad_id, body) {
        const conn = await pool.getConnection();
        try {
            const {
                type_id, status_id, applied_date,
                leave_from, leave_to, desc,
                rejection_remarks, updated_by
            } = body;

            await conn.query(
                `CALL sp_leave_application_update(?, ?, ?, ?, ?, ?, ?, ?, ?, @p_message)`,
                [
                    ulad_id,
                    type_id          ?? null,
                    status_id        ?? null,
                    applied_date     ?? null,
                    leave_from       ?? null,
                    leave_to         ?? null,
                    desc             ?? null,
                    rejection_remarks ?? null,
                    updated_by
                ]
            );

            const [[result]] = await conn.query(`SELECT @p_message AS message`);
            return result.message;
        } finally {
            conn.release();
        }
    }

    static async remove(ulad_id, updated_by) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                `CALL sp_leave_application_delete(?, ?, @p_message)`,
                [ulad_id, updated_by]
            );

            const [[result]] = await conn.query(`SELECT @p_message AS message`);
            return result.message;
        } finally {
            conn.release();
        }
    }
}