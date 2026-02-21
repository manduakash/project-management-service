import pool from "../config/db.js";

class ProjectModel {

  static async save_project(projectId, projectName, entryUserId) {
    const connection = await pool.getConnection();
    try {
      projectId = projectId === undefined || projectId === null ? 0 : projectId;
      projectName = projectName || "";
      entryUserId = entryUserId || 0;

      const params = [projectId, projectName, entryUserId];

      await connection.query(
        "CALL sp_saveProjectDetails(?, ?, ?, @ErrorCode)",
        params
      );

      const [[{ ErrorCode }]] = await connection.query(
        "SELECT @ErrorCode AS ErrorCode"
      );

      return ErrorCode;
    } finally {
      connection.release();
    }
  }

  static async get_all_projects() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getAllProjectDetails()"
      );

      return rows[0] || [];
    } finally {
      connection.release();
    }
  }
}

export default ProjectModel;
