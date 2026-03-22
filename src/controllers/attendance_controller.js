import AttendanceService from "../services/attendance_service.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import "pdfkit-table";

class AttendanceController {
  static async updateDailyAttendance(req, res) {
    try {
      const { user_id, date, check_in, status_id, work_location_id, remarks } = req.body;
      const exec_user_id = req.user.UserID;

      const response = await AttendanceService.updateDailyAttendance(user_id, date, check_in, "18:30:00", status_id, work_location_id, remarks, exec_user_id);

      if (response?.success) {
        return res.status(200).json({
          status: "success",
          message: response?.message,
        });
      } else if (!success) {
        return res.status(404).json({
          status: "failed",
          message: response?.message || "Failed to update",
        });
      } else {
        return res.status(500).json({
          status: "failed",
          message: response?.message || "Failed to update notification status",
          errorCode: errorCode,
        });
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  }

  static async getDailyAttendance(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          status: "failed",
          message: "date is required",
        });
      }

      const attendanceLogs = await AttendanceService.getDailyAttendance(date);

      return res.status(200).json({
        status: "success",
        data: attendanceLogs,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error?.message || "Internal server error",
      });
    }
  }

  static async getMonthlyAttendanceReport(req, res) {
    try {
      const { month, year } = req.query;

      if (!month) {
        return res.status(400).json({
          status: "failed",
          message: "Month is reuired",
        });
      } else if (!year) {
        return res.status(400).json({
          status: "failed",
          message: "Year is reuired",
        });
      }

      const attendanceReport = await AttendanceService.getMonthlyAttendanceReport(month, year);

      return res.status(200).json({
        status: "success",
        data: attendanceReport,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: error?.message || "Internal server error",
      });
    }
  }

  static async exportMonthlyAttendanceReport(req, res) {
    try {
      const { month, year, exportType } = req.query;

      // ✅ Validation
      if (!month) {
        return res.status(400).json({
          status: "failed",
          message: "Month is required",
        });
      }

      if (!year) {
        return res.status(400).json({
          status: "failed",
          message: "Year is required",
        });
      }

      if (exportType && !["excel", "pdf"].includes(exportType)) {
        return res.status(400).json({
          status: "failed",
          message: "exportType must be 'excel' or 'pdf'",
        });
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
}

export default AttendanceController;
