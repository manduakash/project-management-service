import DesignationService from "../services/designation_service.js";
import response from "../utils/response.js";

class DesignationController {
  static async getAll(req, res) {
    try {
      const data = await DesignationService.getAll();
      return response.success(res, data, "designations fetched", 200);
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }
}

export default DesignationController;
