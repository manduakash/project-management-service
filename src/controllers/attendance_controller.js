import AttendanceService from "../services/attendance_service.js";
import response from "../utils/response.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import "pdfkit-table";

class AttendanceController {
  static async updateDailyAttendance(req, res) {
    try {
      const { user_id, date, check_in, status_id, work_location_id, remarks } = req.body;
      const exec_user_id = req.user.UserID;

      const errorCode = await AttendanceService.updateDailyAttendance(user_id, date, check_in, "18:30:00", status_id, work_location_id, remarks, exec_user_id);
      
      if (errorCode === 0) {
        return response.success(res, null, "Attendance updated successfully", 200);
      } else {
        return response.error(res, "Failed to update attendance status", errorCode === 4 ? 404 : 500, errorCode);
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      return response.error(res, "Internal server error", 500);
    }
  }

  static async getDailyAttendance(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return response.error(res, "date is required", 400);
      }

      const attendanceLogs = await AttendanceService.getDailyAttendance(date);

      return response.success(res, attendanceLogs, "attendance logs fetched", 200);
    } catch (error) {
      return response.error(res, error?.message || "Internal server error", 500);
    }
  }

  static async getMonthlyAttendanceReport(req, res) {
    try {
      const { month, year } = req.query;

      if (!month) {
        return response.error(res, "Month is required", 400);
      } else if (!year) {
        return response.error(res, "Year is required", 400);
      }

      const attendanceReport = await AttendanceService.getMonthlyAttendanceReport(month, year);

      return response.success(res, attendanceReport, "attendance report fetched", 200);
    } catch (error) {
      return response.error(res, error?.message || "Internal server error", 500);
    }
  }

  static async exportMonthlyAttendanceReport(req, res) {
    // ... existing export code ...
    // (I'll keep the whole method content for correctness in substitution)
    try {
      const { month, year, exportType } = req.query;

      // ✅ Validation
      if (!month) {
        return response.error(res, "Month is required", 400);
      }

      if (!year) {
        return response.error(res, "Year is required", 400);
      }

      if (exportType && !["excel", "pdf"].includes(exportType)) {
        return response.error(res, "exportType must be 'excel' or 'pdf'", 400);
      }

      const attendanceReport =
        await AttendanceService.getMonthlyAttendanceReport(month, year);

      // ✅ Default JSON response
      if (!exportType) {
        return res.status(200).json({
          status: "success",
          data: attendanceReport,
        });
      }

      // =======================
      // 📊 EXCEL EXPORT
      // =======================
      if (exportType === "excel") {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attendance Report");

        if (!attendanceReport || attendanceReport.length === 0) {
          worksheet.addRow(["No data available"]);
        } else {
          const columns = Object.keys(attendanceReport[0]).map((key) => ({
            header: key.toUpperCase(),
            key: key,
            width: 20,
          }));

          worksheet.columns = columns;

          attendanceReport.forEach((row) => {
            worksheet.addRow(row);
          });
        }

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=attendance_${month}_${year}.xlsx`
        );

        await workbook.xlsx.write(res);
        return res.end();
      }

      // =======================
      // 📄 PDF EXPORT (TABLE)
      // =======================
      if (exportType === "pdf") {
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=attendance_${month}_${year}.pdf`
        );

        doc.pipe(res);

        // Title
        doc
          .fontSize(16)
          .text(`Attendance Report - ${month}/${year}`, {
            align: "center",
          });

        doc.moveDown();

        if (!attendanceReport || attendanceReport.length === 0) {
          doc.text("No data available");
          doc.end();
          return;
        }

        // ✅ USE EXACT KEY NAMES (case-sensitive)
        const table = {
          headers: [
            { label: "ID", property: "ID", width: 60 },
            { label: "NAME", property: "Name", width: 120 },
            { label: "ROLENAME", property: "RoleName", width: 100 },
            { label: "PRESENT", property: "Present", width: 60 },
            { label: "ABSENT", property: "Absent", width: 60 },
            { label: "LATE", property: "Late", width: 50 },
            { label: "LEAVE", property: "Leave", width: 60 },
            { label: "TOTAL", property: "Total", width: 60 },
            { label: "PUNCTUALITY", property: "Punctuality", width: 90 },
          ],
          datas: attendanceReport,
        };

        await doc.table(table, {
          width: "auto",
          prepareHeader: () =>
            doc.font("Helvetica-Bold").fontSize(9),
          prepareRow: (row, i) => {
            doc.font("Helvetica").fontSize(8);
          },
        });

        doc.end();
        return;
      }
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error?.message || "Internal server error",
      });
    }

  }

  static async getEmployeeAttendanceReport(req, res) {
    try {
      const { fromDate, toDate } = req.query;
      const userId = req.user.UserID;

      if (!fromDate || !toDate) {
        return response.error(res, "fromDate and toDate are required", 400);
      }

      const report = await AttendanceService.getEmployeeAttendanceReport(userId, fromDate, toDate);

      return response.success(res, report, "Employee attendance report fetched", 200);
    } catch (error) {
      return response.error(res, error?.message || "Internal server error", 500);
    }
  }

  static async getDailyAttendanceLogForAdmin(req, res) {
    try {
      const userId = req.user.UserID;

      const logs = await AttendanceService.getDailyAttendanceLogForAdmin(userId);

      return response.success(res, logs, "Daily attendance logs for admin fetched", 200);
    } catch (error) {
      return response.error(res, error?.message || "Internal server error", 500);
    }
  }
}

export default AttendanceController;
