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

    static async getAllTaskStatuses() {
        const rows = await MasterModel.get_all_task_statuses();
        return rows;
    }

    static async getAllTaskTypes() {
        const rows = await MasterModel.get_all_task_types();
        return rows;
    }

    static async getAllSeniorityLevels() {
        const rows = await MasterModel.get_all_seniority_levels();
        return rows;
    }

    static async getAllOrganizationDetails() {
        const rows = await MasterModel.get_all_organization_details();
        return rows;
    }

    static async getAnnualHolidayList(userId, year) {
        const rows = await MasterModel.get_annual_holiday_list(userId, year);
        return rows;
    }

    static async saveAnnualHolidayDetails(year, date, description, entryUserId) {
        const errorCode = await MasterModel.save_annual_holiday_details(year, date, description, entryUserId);
        return errorCode;
    }
}

export default MasterService;
