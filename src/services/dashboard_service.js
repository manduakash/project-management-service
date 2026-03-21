
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
}

export default DashboardService;
