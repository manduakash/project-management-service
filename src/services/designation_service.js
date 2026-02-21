import DesignationModel from "../models/designation_model.js";

class DesignationService {
  static async getAll() {
    const rows = await DesignationModel.get_all_designations();
    return rows;
  }
}

export default DesignationService;
