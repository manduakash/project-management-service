import MasterService from "../services/master_service.js";
import response from "../utils/response.js";

class MasterController {
    static async getAllProjectStatuses(req, res) {
        try {
            const data = await MasterService.getAllProjectStatuses();
            return response.success(res, data, "project statuses fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllPriorities(req, res) {
        try {
            const data = await MasterService.getAllPriorities();
            return response.success(res, data, "priorities fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllProjectTypes(req, res) {
        try {
            const data = await MasterService.getAllProjectTypes();
            return response.success(res, data, "project types fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }
}

export default MasterController;
