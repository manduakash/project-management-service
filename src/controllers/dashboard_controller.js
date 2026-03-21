
import DashboardService from "../services/dashboard_service.js";
import response from "../utils/response.js";

class DashboardController {
        static async getDeveloperWiseTeamProgressGraph(req, res) {
            try {
                const userId = req.user?.UserID;
                if (!userId) {
                    return response.error(res, "invalid token: missing user information", 401);
                }
                const rows = await DashboardService.getDeveloperWiseTeamProgressGraph(userId);
                return response.success(res, rows, "developer wise team progress graph fetched", 200);
            } catch (err) {
                return response.error(res, err.message, 500);
            }
        }
    static async getCount(req, res) {
        try {
            const userId = req.user?.UserID
            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }
            const rows = await DashboardService.getDashboardCount(userId);
            const data = rows.length > 0 ? rows[0] : {};
            return response.success(res, data, "dashboard count fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
    static async get(req, res) {
        try {
            const userId = req.user?.UserID
            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const fromDate = req.query.fromDate ?? req.query.FromDate;
            const toDate = req.query.toDate ?? req.query.ToDate;

            if (!fromDate || !toDate) {
                return response.error(res, "missing parameters: fromDate and toDate are required", 400);
            }

            // Validate date format
            if (Number.isNaN(Date.parse(fromDate))) {
                return response.error(res, "fromDate must be a valid date (YYYY-MM-DD)", 400);
            }
            if (Number.isNaN(Date.parse(toDate))) {
                return response.error(res, "toDate must be a valid date (YYYY-MM-DD)", 400);
            }

            const rows = await DashboardService.getDashboardDetails(userId, fromDate, toDate);

            // SP returns a single row with the dashboard stats
            const data = rows.length > 0 ? rows[0] : {
                NoOfActiveProjects: 0,
                NoOfUrgentTasks: 0,
                NoOfCompletedTasks: 0,
                NoOfGoLiveProjects: 0
            };

            return response.success(res, data, "dashboard details fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
        static async getTeamMemberGraphDetails(req, res) {
        try {
            const userId = req.user?.UserID;
            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }
            const rows = await DashboardService.getTeamMemberGraphDetails(userId);
            return response.success(res, rows, "team member graph details fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getDashboardWeeklyTaskProgressGraph(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getDashboardWeeklyTaskProgressGraph(userId);
            return response.success(res, rows, "weekly task progress graph fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getDeveloperDashboardDeadlineCrossedDetails(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getDeveloperDashboardDeadlineCrossedDetails(userId);
            return response.success(res, rows, "deadline crossed tasks fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getProjectWiseProgressForAdmin(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getProjectWiseProgressForAdmin(userId);
            return response.success(res, rows, "project wise progress for admin fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getTeamLeadStatusForAdmin(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getTeamLeadStatusForAdmin(userId);
            return response.success(res, rows, "team lead status for admin fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
}

export default DashboardController;
