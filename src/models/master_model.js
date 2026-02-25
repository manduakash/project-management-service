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
}

export default MasterModel;
