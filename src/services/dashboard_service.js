import DashboardModel from "../models/dashboard_model.js";

class DashboardService {
    static async getDashboardCount(userId) {
        return await DashboardModel.get_dashboard_count(userId);
    }
    static async getDashboardDetails(userId, fromDate, toDate) {
        const rows = await DashboardModel.get_dashboard_details(userId, fromDate, toDate);
        return rows;
    }
}

export default DashboardService;
