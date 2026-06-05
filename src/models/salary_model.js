import pool from "../config/db.js";

class SalaryModel {

    static async getAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query("CALL sp_salary_get_all()");
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async getById(es_id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query("CALL sp_salary_get_by_id(?)", [es_id]);
            return rows[0]?.[0] || null;
        } finally {
            connection.release();
        }
    }

    static async update(es_id, payload) {
        const connection = await pool.getConnection();
        try {
            const {
                es_designation, es_monthly_salary,
                es_basic, es_hra, es_conv_allow, es_special_allow,
                es_pf_employee, es_esi_employee, es_ptax,
                es_bank_ac_no, es_ifsc_code, es_effective_from
            } = payload;

            const [rows] = await connection.query(
                "CALL sp_salary_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_message)",
                [
                    es_id, es_designation, es_monthly_salary,
                    es_basic, es_hra, es_conv_allow, es_special_allow,
                    es_pf_employee, es_esi_employee, es_ptax,
                    es_bank_ac_no, es_ifsc_code, es_effective_from
                ]
            );
            const [[{ p_message }]] = await connection.query("SELECT @p_message AS p_message");
            return p_message;
        } finally {
            connection.release();
        }
    }

    static async getSalaryRecords(ua_id, month, year) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_salary_records_get(?, ?, ?)",
                [ua_id, month, year]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

}

export default SalaryModel;