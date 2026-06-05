import WeekOffModel from "../models/weekoff_model.js";

class WeekOffService {

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
        return await WeekOffModel.getAll(month, year);
    }

    static async getById(id) {
        if (!id || isNaN(id) || id <= 0)
            throw new Error("Invalid week off ID.");
        const record = await WeekOffModel.getById(id);
        if (!record) throw new Error(`Week off ID ${id} not found.`);
        return record;
    }

    static async insert(body) {
        const { off_date } = body;
        if (!off_date) throw new Error("off_date is required.");
        if (isNaN(Date.parse(off_date))) throw new Error("Invalid off_date format. Use YYYY-MM-DD.");

        const result = await WeekOffModel.insert(off_date);
        if (result.message?.startsWith("ERROR:")) throw new Error(result.message);
        return { new_id: result.new_id, message: result.message };
    }

    static async update(id, body) {
        if (!id || isNaN(id) || id <= 0) throw new Error("Invalid week off ID.");
        const { off_date } = body;
        if (!off_date) throw new Error("off_date is required.");
        if (isNaN(Date.parse(off_date))) throw new Error("Invalid off_date format. Use YYYY-MM-DD.");

        const message = await WeekOffModel.update(id, off_date);
        if (message?.startsWith("ERROR:")) throw new Error(message);
        return message;
    }

    static async delete(id) {
        if (!id || isNaN(id) || id <= 0) throw new Error("Invalid week off ID.");
        const message = await WeekOffModel.delete(id);
        if (message?.startsWith("ERROR:")) throw new Error(message);
        return message;
    }

}

export default WeekOffService;