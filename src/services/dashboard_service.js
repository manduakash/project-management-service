
import DashboardModel from "../models/dashboard_model.js";

class DashboardService {
    static async getDeveloperWiseTeamProgressGraph(userId) {
        return await DashboardModel.get_developer_wise_team_progress_graph(userId);
    }
    static async getDashboardCount(userId) {
        return await DashboardModel.get_dashboard_count(userId);
    }
    static async getDashboardDetails(userId, fromDate, toDate) {
        const rows = await DashboardModel.get_dashboard_details(userId, fromDate, toDate);
        return rows;
    }
    static async getTeamMemberGraphDetails(userId) {
        return await DashboardModel.get_team_member_graph_details(userId);
    }

    static async getDashboardWeeklyTaskProgressGraph(userId) {
        return await DashboardModel.get_dashboard_weekly_task_progress_graph(userId);
    }

    static async getDeveloperDashboardDeadlineCrossedDetails(userId) {
        return await DashboardModel.get_developer_dashboard_deadline_crossed_details(userId);
    }

    static async getProjectWiseProgressForAdmin(userId) {
        return await DashboardModel.get_project_wise_progress_for_admin(userId);
    }

    static async getTeamLeadStatusForAdmin(userId) {
        return await DashboardModel.get_team_lead_status_for_admin(userId);
    }

    static async getResourceAllocationChart(userId) {
        return await DashboardModel.get_resource_allocation_chart(userId);
    }

    static async getDeveloperOutputChart(userId) {
        return await DashboardModel.get_developer_output_chart(userId);
    }

    static async getLeadershipPerformanceChart(userId) {
        return await DashboardModel.get_leadership_performance_chart(userId);
    }

    static async getProjectTenureGraph(userId) {
        return await DashboardModel.get_project_tenure_graph(userId);
    }

    static async getTeamLeadStatsForAdmin(userId) {
        return await DashboardModel.get_team_lead_stats_for_admin(userId);
    }
    static async getWeeklyAttendanceTrend(userId) {
        return await DashboardModel.get_weekly_attendance_trend(userId);
    }

    // Parse & validate month/year from query params
    static #parseFilters(query) {
        const now = new Date();
        const month = parseInt(query.month ?? now.getMonth() + 1);  // 0 = all months
        const year = parseInt(query.year ?? now.getFullYear());
        const user_id = parseInt(query.user_id ?? 0);                   // 0 = all employees

        if (isNaN(month) || month < 0 || month > 12)
            throw new Error("Invalid month. Use 1–12 or 0 for all months.");

        if (isNaN(year) || year < 2000 || year > 2100)
            throw new Error("Invalid year.");

        if (isNaN(user_id) || user_id < 0)
            throw new Error("Invalid user_id.");

        return { user_id, month, year };
    }

    static async getDashboardSummary(query) {
        const { user_id, month, year } = this.#parseFilters(query);
        return await DashboardModel.getDashboardSummary(user_id, month, year);
    }

    static async getAttendanceReport(query) {
        const { user_id, month, year } = this.#parseFilters(query);
        return await DashboardModel.getAttendanceReport(user_id, month, year);
    }

    static async getDiscipline(query) {
        const { user_id, month, year } = this.#parseFilters(query);
        return await DashboardModel.getDiscipline(user_id, month, year);
    }

    static async getSalary(query) {
        const { user_id, month, year } = this.#parseFilters(query);
        return await DashboardModel.getSalary(user_id, month, year);
    }

    static async getLeaves(query) {
        const { user_id, month, year } = this.#parseFilters(query);
        return await DashboardModel.getLeaves(user_id, month, year);
    }

    static async getWorking(query) {
        const { user_id, month, year } = this.#parseFilters(query);
        return await DashboardModel.getWorking(user_id, month, year);
    }

    static async getAllEmployees() {
        return await DashboardModel.getAllEmployees();
    }
}

export default DashboardService;
