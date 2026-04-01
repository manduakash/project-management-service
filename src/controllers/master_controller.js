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

    static async getAllTaskStatuses(req, res) {
        try {
            const data = await MasterService.getAllTaskStatuses();
            return response.success(res, data, "task statuses fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllTaskTypes(req, res) {
        try {
            const data = await MasterService.getAllTaskTypes();
            return response.success(res, data, "task types fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllSeniorityLevels(req, res) {
        try {
            const data = await MasterService.getAllSeniorityLevels();
            return response.success(res, data, "seniority levels fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllOrganizationDetails(req, res) {
        try {
            const data = await MasterService.getAllOrganizationDetails();
            return response.success(res, data, "organization details fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAnnualHolidayList(req, res) {
        try {
            const { year } = req.query;
            const userId = req.user?.UserID || req.user?.UserId || req.user?.ua_id;
            
            if (!year) {
                return response.error(res, "year is required", 400);
            }

            const data = await MasterService.getAnnualHolidayList(userId, year);
            return response.success(res, data, "annual holiday list fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async saveAnnualHolidayDetails(req, res) {
        try {
            const { yearValue, holidayDate, holidayDescription } = req.body;
            const entryUserId = req.user?.UserID || req.user?.UserId || req.user?.ua_id;

            if (!yearValue || !holidayDate || !holidayDescription) {
                return response.error(res, "yearValue, holidayDate, and holidayDescription are required", 400);
            }

            const errorCode = await MasterService.saveAnnualHolidayDetails(yearValue, holidayDate, holidayDescription, entryUserId);

            if (errorCode === 0) {
                return response.success(res, null, "Annual holiday details saved successfully", 201);
            } else if (errorCode === 1) {
                return response.error(res, "Holiday already exists for this date", 409);
            } else {
                return response.error(res, `Failed with error code: ${errorCode}`, 500);
            }
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllLeaveApplicationTypes(req, res) {
        try {
            const data = await MasterService.getAllLeaveApplicationTypes();
            return response.success(res, data, "leave application types fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }

    static async getAllLeaveApplicationStatuses(req, res) {
        try {
            const data = await MasterService.getAllLeaveApplicationStatuses();
            return response.success(res, data, "leave application statuses fetched", 200);
        } catch (error) {
            return response.error(res, error.message, 500);
        }
    }
}

export default MasterController;
