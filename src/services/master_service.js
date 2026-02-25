import MasterModel from "../models/master_model.js";

class MasterService {
    static async getAllProjectStatuses() {
        const rows = await MasterModel.get_all_project_statuses();
        return rows;
    }

    static async getAllPriorities() {
        const rows = await MasterModel.get_all_priorities();
        return rows;
    }

    static async getAllProjectTypes() {
        const rows = await MasterModel.get_all_project_types();
        return rows;
    }
}

export default MasterService;
