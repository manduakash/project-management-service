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

    static async updateSalaryStructure(payload) {
        const connection = await pool.getConnection();
        try {
            const {
                es_id,
                es_designation,
                es_monthly_salary,
                es_basic,
                es_hra,
                es_conv_allow,
                es_special_allow,
                es_pf_employee,
                es_esi_employee,
                es_ptax,
                es_is_discipline_applicable,
                es_other_incentive,
                es_bank_ac_no,
                es_ifsc_code,
                es_effective_from,
                es_mobile_no
            } = payload;

            await connection.query(
                `CALL sp_salary_update(
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?,
        @p_message
    )`,
                [
                    es_id,                        // 1  p_es_id
                    es_designation,               // 2  p_es_designation
                    es_monthly_salary,            // 3  p_es_monthly_salary
                    es_basic,                     // 4  p_es_basic
                    es_hra,                       // 5  p_es_hra
                    es_conv_allow,                // 6  p_es_conv_allow
                    es_special_allow,             // 7  p_es_special_allow
                    es_pf_employee,               // 8  p_es_pf_employee
                    es_esi_employee,              // 9  p_es_esi_employee
                    es_ptax,                      // 10 p_es_ptax
                    es_is_discipline_applicable,  // 11 p_es_is_discipline_applicable
                    es_other_incentive,           // 12 p_es_other_incentive
                    es_bank_ac_no,                // 13 p_es_bank_ac_no
                    es_ifsc_code,                 // 14 p_es_ifsc_code
                    es_effective_from,            // 15 p_es_effective_from
                    es_mobile_no                  // 16 p_es_mobile_no
                ]
            );

            const [[result]] = await connection.query(
                "SELECT @p_message AS p_message"
            );
            return result; // { p_message }
        } finally {
            connection.release();
        }
    }

    static async upsert(payload) {
        const connection = await pool.getConnection();
        try {
            const {
                sr_id,
                sr_es_id, sr_ua_id, sr_nspl_id, sr_designation, sr_salary_month,
                sr_basic, sr_hra, sr_conv_allow, sr_special_allow,
                sr_pf_employee, sr_esi_employee, sr_ptax,
                sr_working_days, sr_present_days, sr_lop_days,
                sr_excess_leave_deduction, sr_discipline_incentive, sr_other_bonus_incentive,
                sr_bank_ac_no, sr_ifsc_code,
                sr_payment_date, sr_payment_mode, sr_status, sr_remarks
            } = payload;

            await connection.query(
                `CALL sp_salary_record_upsert(
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?, ?,
                ?, ?, ?, ?,
                @p_new_sr_id, @p_message
            )`,
                [
                    sr_id,
                    sr_es_id, sr_ua_id, sr_nspl_id, sr_designation, sr_salary_month,
                    sr_basic, sr_hra, sr_conv_allow, sr_special_allow,
                    sr_pf_employee, sr_esi_employee, sr_ptax,
                    sr_working_days, sr_present_days, sr_lop_days,
                    sr_excess_leave_deduction, sr_discipline_incentive, sr_other_bonus_incentive,
                    sr_bank_ac_no, sr_ifsc_code,
                    sr_payment_date, sr_payment_mode, sr_status, sr_remarks
                ]
            );

            const [[result]] = await connection.query(
                "SELECT @p_new_sr_id AS sr_id, @p_message AS p_message"
            );
            return result; // { sr_id, p_message }
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