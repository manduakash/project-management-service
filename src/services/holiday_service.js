import HolidayModel from "../models/holiday_model.js";

class HolidayService {

    static #parseFilters(query) {
        const now   = new Date();
        const month = parseInt(query.month ?? 0);
        const year  = parseInt(query.year  ?? now.getFullYear());

        if (isNaN(month) || month < 0 || month > 12)
            throw new Error("Invalid month. Use 1–12 or 0 for all months.");
        if (isNaN(year) || year < 2000 || year > 2100)
            throw new Error("Invalid year.");

        return { month, year };
    }

    static async getAll(query) {
        const { month, year } = this.#parseFilters(query);
        return await HolidayModel.getAll(month, year);
    }

    static async getById(id) {
        if (!id || isNaN(id) || id <= 0)
            throw new Error("Invalid holiday ID.");
        const record = await HolidayModel.getById(id);
        if (!record) throw new Error(`Holiday ID ${id} not found.`);
        return record;
    }

    static async insert(body) {
        const { hm_name, hm_date } = body;
        if (!hm_name) throw new Error("hm_name is required.");
        if (!hm_date)  throw new Error("hm_date is required.");
        if (isNaN(Date.parse(hm_date))) throw new Error("Invalid hm_date format. Use YYYY-MM-DD.");

        const result = await HolidayModel.insert(hm_name, hm_date);
        if (result.message?.startsWith("ERROR:")) throw new Error(result.message);
        return { new_id: result.new_id, message: result.message };
    }

    static async update(id, body) {
        if (!id || isNaN(id) || id <= 0) throw new Error("Invalid holiday ID.");
        const { hm_name, hm_date } = body;
        if (!hm_name) throw new Error("hm_name is required.");
        if (!hm_date)  throw new Error("hm_date is required.");
        if (isNaN(Date.parse(hm_date))) throw new Error("Invalid hm_date format. Use YYYY-MM-DD.");

        const message = await HolidayModel.update(id, hm_name, hm_date);
        if (message?.startsWith("ERROR:")) throw new Error(message);
        return message;
    }

    static async delete(id) {
        if (!id || isNaN(id) || id <= 0) throw new Error("Invalid holiday ID.");
        const message = await HolidayModel.delete(id);
        if (message?.startsWith("ERROR:")) throw new Error(message);
        return message;
    }

}

export default HolidayService;