import SalaryService from "../services/salary_service.js";
import response from "../utils/response.js";

class SalaryController {

    /**
     * GET /api/accountant/salary
     * Returns all active employee salary structures
     */
    static async getAll(req, res) {
        try {
            const data = await SalaryService.getAll();
            return response.success(res, data, "Salary records fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
     * GET /api/accountant/salary/:id
     * Returns single employee salary structure by es_id
     */
    static async getById(req, res) {
        try {
            const es_id = parseInt(req.params.id);
            const data  = await SalaryService.getById(es_id);
            return response.success(res, data, "Salary record fetched successfully.", 200);
        } catch (err) {
            const status = err.message.includes("Invalid") ? 400
                         : err.message.includes("No active") ? 404 : 500;
            return response.error(res, err.message, status);
        }
    }

    /**
     * PUT /api/accountant/salary/:id
     * Updates employee salary structure
     */
    static async update(req, res) {
        try {
            const es_id   = parseInt(req.params.id);
            const message = await SalaryService.update(es_id, req.body);
            return response.success(res, null, message, 200);
        } catch (err) {
            const status = err.message.includes("Invalid") || err.message.includes("Missing") ? 400
                         : err.message.includes("No active") ? 404 : 500;
            return response.error(res, err.message, status);
        }
    }

    /**
     * GET /api/accountant/salary/records
     * Query: ?ua_id=3&month=5&year=2026
     *        ua_id=0  → all employees
     *        month=0  → all months
     */
    static async getSalaryRecords(req, res) {
        try {
            const data = await SalaryService.getSalaryRecords(req.query);
            return response.success(res, data, "Salary records fetched successfully.", 200);
        } catch (err) {
            const status = err.message.includes("Invalid") ? 400 : 500;
            return response.error(res, err.message, status);
        }
    }

}

export default SalaryController;