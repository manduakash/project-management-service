import DashboardService from "../services/dashboard_service.js";
import response from "../utils/response.js";

class DashboardController {
    static async get(req, res) {
        try {
            const userId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
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
}

export default DashboardController;
