
import DashboardService from "../services/dashboard_service.js";
import response from "../utils/response.js";
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import path from 'path';
import numberToWords from 'number-to-words';
import fs from 'fs';

class DashboardController {
    static async getWeeklyAttendanceTrend(req, res) {
        try {
            const userId = req.user?.UserID;
            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }
            const rows = await DashboardService.getWeeklyAttendanceTrend(userId);
            return response.success(res, rows, "weekly attendance trend fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
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

    static async getResourceAllocationChart(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getResourceAllocationChart(userId);
            return response.success(res, rows, "resource allocation chart fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getDeveloperOutputChart(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getDeveloperOutputChart(userId);
            return response.success(res, rows, "developer output chart fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getLeadershipPerformanceChart(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getLeadershipPerformanceChart(userId);
            return response.success(res, rows, "leadership performance chart fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getProjectTenureGraph(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getProjectTenureGraph(userId);
            return response.success(res, rows, "project tenure graph fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getTeamLeadStatsForAdmin(req, res) {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                return response.error(res, "invalid token: missing user information", 401);
            }

            const rows = await DashboardService.getTeamLeadStatsForAdmin(userId);
            return response.success(res, rows, "team lead stats for admin fetched", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
    * GET /api/accountant/dashboard/summary
    * Query: ?user_id=3&month=5&year=2026
    *        user_id=0  → all employees
    *        month=0  → all months of the year
    */
    static async getDashboardSummary(req, res) {
        try {
            const data = await DashboardService.getDashboardSummary(req.query);
            return response.success(res, data, "Dashboard summary fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
     * GET /api/accountant/dashboard/attendance-report
     * Query: ?user_id=3&month=5&year=2026
     */
    static async getAttendanceReport(req, res) {
        try {
            const data = await DashboardService.getAttendanceReport(req.query);
            return response.success(res, data, "Attendance report fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
     * GET /api/accountant/dashboard/discipline
     * Query: ?user_id=3&month=5&year=2026
     */
    static async getDiscipline(req, res) {
        try {
            const data = await DashboardService.getDiscipline(req.query);
            return response.success(res, data, "Discipline data fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
     * GET /api/accountant/dashboard/salary
     * Query: ?user_id=3&month=5&year=2026
     */
    static async getSalary(req, res) {
        try {
            const data = await DashboardService.getSalary(req.query);
            return response.success(res, data, "Salary data fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    // static async generateSalarySlip(req, res) {
    //     try {
    //         const data = await DashboardService.getSalary(req.query);

    //         const netSalaryWords = numberToWords.toWords(data[0].net_salary || 0);

    //         // ✅ Read logo as base64
    //         const logoBase64 = fs.readFileSync(
    //             path.join(process.cwd(), 'src/public/images/logo.png')
    //         ).toString('base64');

    //         const html = await ejs.renderFile(
    //             path.join(process.cwd(), '/src/views', 'payslip.ejs'),
    //             { salary: data[0], netSalaryWords, logoBase64 }  // ✅ pass it
    //         );

    //         const browser = await puppeteer.launch({
    //             headless: true,
    //             args: ['--no-sandbox']
    //         });

    //         const page = await browser.newPage();

    //         await page.setContent(html, { waitUntil: 'networkidle0' });

    //         const pdf = await page.pdf({ format: 'A4', printBackground: true });

    //         await browser.close();

    //         res.setHeader('Content-Type', 'application/pdf');
    //         res.setHeader('Content-Disposition', `inline; filename=salary-slip.pdf`);
    //         res.end(pdf);

    //     } catch (err) {
    //         return response.error(res, err.message, 500);
    //     }
    // }

    static async generateSalarySlip(req, res) {
        try {
            const data = await DashboardService.getSalary(req.query);

            const netSalaryWords = numberToWords.toWords(data[0].net_salary || 0);

            const logoBase64 = fs.readFileSync(
                path.join(process.cwd(), 'src/public/images/logo.png')
            ).toString('base64');

            const html = await ejs.renderFile(
                path.join(process.cwd(), '/src/views', 'payslip.ejs'),
                { salary: data[0], netSalaryWords, logoBase64 }
            );

            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });

            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true
            });

            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=salary-slip.pdf`);
            res.end(pdf);

        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
     * GET /api/accountant/dashboard/leaves
     * Query: ?user_id=3&month=5&year=2026
     */
    static async getLeaves(req, res) {
        try {
            const data = await DashboardService.getLeaves(req.query);
            return response.success(res, data, "Leaves data fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    /**
     * GET /api/accountant/dashboard/working
     * Query: ?user_id=3&month=5&year=2026
     */
    static async getWorking(req, res) {
        try {
            const data = await DashboardService.getWorking(req.query);
            return response.success(res, data, "Working data fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }

    static async getAllEmployees(req, res) {
        try {
            const data = await DashboardService.getAllEmployees();
            return response.success(res, data, "Employees fetched successfully.", 200);
        } catch (err) {
            return response.error(res, err.message, 500);
        }
    }
}

export default DashboardController;
