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

    static async update(es_id, body) {
        if (!es_id || isNaN(es_id) || es_id <= 0)
            throw new Error("Invalid salary ID.");

        const required = [
            "es_designation", "es_monthly_salary",
            "es_basic", "es_hra", "es_conv_allow", "es_special_allow",
            "es_pf_employee", "es_esi_employee", "es_ptax",
            "es_bank_ac_no", "es_ifsc_code", "es_effective_from"
        ];

        for (const field of required) {
            if (body[field] === undefined || body[field] === null || body[field] === "") {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const message = await SalaryModel.update(es_id, body);

        if (message?.startsWith("ERROR:"))
            throw new Error(message);

        return message;
    }

    static async getSalaryRecords(query) {
        const now   = new Date();
        const ua_id = parseInt(query.ua_id ?? 0);
        const month = parseInt(query.month ?? 0);
        const year  = parseInt(query.year  ?? now.getFullYear());

        if (isNaN(ua_id) || ua_id < 0)  throw new Error("Invalid ua_id.");
        if (isNaN(month) || month < 0 || month > 12) throw new Error("Invalid month. Use 1–12 or 0 for all.");
        if (isNaN(year)  || year < 2000 || year > 2100) throw new Error("Invalid year.");

        return await SalaryModel.getSalaryRecords(ua_id, month, year);
    }

}

export default SalaryService;