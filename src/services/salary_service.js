import SalaryModel from "../models/salary_model.js";

class SalaryService {

    static async getAll() {
        return await SalaryModel.getAll();
    }

    static async getById(es_id) {
        if (!es_id || isNaN(es_id) || es_id <= 0)
            throw new Error("Invalid salary ID.");

        const record = await SalaryModel.getById(es_id);
        if (!record)
            throw new Error(`No active salary record found for ID ${es_id}.`);

        return record;
    }

    static async upsert(body) {
        const isUpdate = body.sr_id && parseInt(body.sr_id) > 0;

        // ── Normalise sr_id ──────────────────────────────────────────────────────
        body.sr_id = isUpdate ? parseInt(body.sr_id) : 0;

        // ── Required for both INSERT and UPDATE ──────────────────────────────────
        const alwaysRequired = [
            "sr_es_id", "sr_ua_id", "sr_salary_month",
            "sr_basic", "sr_hra", "sr_conv_allow", "sr_special_allow",
            "sr_pf_employee", "sr_esi_employee", "sr_ptax",
            "sr_working_days", "sr_present_days", "sr_lop_days",
            "sr_bank_ac_no", "sr_ifsc_code",
            "sr_payment_mode", "sr_status"
        ];

        for (const field of alwaysRequired) {
            if (body[field] === undefined || body[field] === null || body[field] === "") {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // ── Numeric / type guards ────────────────────────────────────────────────
        const numericFields = [
            "sr_es_id", "sr_ua_id",
            "sr_basic", "sr_hra", "sr_conv_allow", "sr_special_allow",
            "sr_pf_employee", "sr_esi_employee", "sr_ptax",
            "sr_working_days", "sr_present_days", "sr_lop_days",
            "sr_excess_leave_deduction", "sr_discipline_incentive", "sr_other_bonus_incentive"
        ];

        for (const field of numericFields) {
            const val = body[field] ?? 0;
            if (isNaN(val) || Number(val) < 0) {
                throw new Error(`Invalid value for field: ${field}`);
            }
            body[field] = Number(val); // normalise strings → numbers
        }

        // ── Enum guards ──────────────────────────────────────────────────────────
        const validModes = ["bank_transfer", "cash", "cheque"];
        const validStatuses = ["pending", "processed", "paid"];

        if (!validModes.includes(body.sr_payment_mode))
            throw new Error(`Invalid sr_payment_mode. Allowed: ${validModes.join(", ")}`);

        if (!validStatuses.includes(body.sr_status))
            throw new Error(`Invalid sr_status. Allowed: ${validStatuses.join(", ")}`);

        // ── Defaults for optional fields ─────────────────────────────────────────
        body.sr_nspl_id = body.sr_nspl_id ?? null;
        body.sr_designation = body.sr_designation ?? null;
        body.sr_excess_leave_deduction = body.sr_excess_leave_deduction ?? 0;
        body.sr_discipline_incentive = body.sr_discipline_incentive ?? 0;
        body.sr_other_bonus_incentive = body.sr_other_bonus_incentive ?? 0;
        body.sr_payment_date = body.sr_payment_date ?? null;
        body.sr_remarks = body.sr_remarks ?? null;

        // ── Call model ───────────────────────────────────────────────────────────
        const result = await SalaryModel.upsert(body);

        if (result?.p_message?.startsWith("ERROR:"))
            throw new Error(result.p_message);

        return result; // { sr_id, p_message }
    }

    static async getSalaryRecords(query) {
        const now = new Date();
        const ua_id = parseInt(query.ua_id ?? 0);
        const month = parseInt(query.month ?? 0);
        const year = parseInt(query.year ?? now.getFullYear());

        if (isNaN(ua_id) || ua_id < 0) throw new Error("Invalid ua_id.");
        if (isNaN(month) || month < 0 || month > 12) throw new Error("Invalid month. Use 1–12 or 0 for all.");
        if (isNaN(year) || year < 2000 || year > 2100) throw new Error("Invalid year.");

        return await SalaryModel.getSalaryRecords(ua_id, month, year);
    }

}

export default SalaryService;