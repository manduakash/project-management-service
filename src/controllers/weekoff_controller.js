import WeekOffService from "../services/weekoff_service.js";
import response from "../utils/response.js";

class WeekOffController {

    /** GET /api/accountant/weekoffs?month=5&year=2026 */
    static async getAll(req, res) {
        try {
            const data = await WeekOffService.getAll(req.query);
            return response.success(res, data, "Week offs fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /** GET /api/accountant/weekoffs/:id */
    static async getById(req, res) {
        try {
            const data = await WeekOffService.getById(parseInt(req.params.id));
            return response.success(res, data, "Week off fetched successfully.", 200);
        } catch (err) {
            const status = err.message.includes("Invalid") ? 400
                         : err.message.includes("not found") ? 404 : 500;
            return response.error(res, err.message, status);
        }
    }

    /** POST /api/accountant/weekoffs */
    static async insert(req, res) {
        try {
            const data = await WeekOffService.insert(req.body);
            return response.success(res, data, data.message, 201);
        } catch (err) {
            const status = err.message.includes("Invalid") || err.message.includes("required") ? 400
                         : err.message.includes("already exists") ? 409 : 500;
            return response.error(res, err.message, status);
        }
    }

    /** PUT /api/accountant/weekoffs/:id */
    static async update(req, res) {
        try {
            const message = await WeekOffService.update(parseInt(req.params.id), req.body);
            return response.success(res, null, message, 200);
        } catch (err) {
            const status = err.message.includes("Invalid") || err.message.includes("required") ? 400
                         : err.message.includes("not found") ? 404
                         : err.message.includes("already exists") ? 409 : 500;
            return response.error(res, err.message, status);
        }
    }

    /** DELETE /api/accountant/weekoffs/:id */
    static async delete(req, res) {
        try {
            const message = await WeekOffService.delete(parseInt(req.params.id));
            return response.success(res, null, message, 200);
        } catch (err) {
            const status = err.message.includes("Invalid") ? 400
                         : err.message.includes("not found") ? 404 : 500;
            return response.error(res, err.message, status);
        }
    }

}

export default WeekOffController;