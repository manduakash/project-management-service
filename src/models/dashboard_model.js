
import pool from "../config/db.js";

class DashboardModel {
        static async get_developer_wise_team_progress_graph(userId) {
            const connection = await pool.getConnection();
            try {
                const [rows] = await connection.query(
                    "CALL sp_getDeveloperWiseTeamProgressGraph(?)",
                    [userId]
                );
                return rows[0] || [];
            } finally {
                connection.release();
            }
        }
    static async get_dashboard_count(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDashboardCount(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }
    static async get_dashboard_details(userId, fromDate, toDate) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDashboardDetails(?, ?, ?)",
                [userId, fromDate, toDate]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

        static async get_team_member_graph_details(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDashboardTeamMemberGraphDetails(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_dashboard_weekly_task_progress_graph(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDashboardWeeklyTaskProgressGraph(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_developer_dashboard_deadline_crossed_details(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDeveloperDashboardDeadlineCrossedDetails(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_project_wise_progress_for_admin(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getProjectWiseProgressForAdmin(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_team_lead_status_for_admin(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getTeamLeadStatusForAdmin(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_resource_allocation_chart(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getResourceAllocationChart(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_developer_output_chart(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getDeveloperOutputChart(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_leadership_performance_chart(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getLeadershipPerformanceChart(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_project_tenure_graph(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getProjectTenureGraph(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }

    static async get_team_lead_stats_for_admin(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                "CALL sp_getTeamLeadStatsForAdmin(?)",
                [userId]
            );
            return rows[0] || [];
        } finally {
            connection.release();
        }
    }
}

export default DashboardModel;
