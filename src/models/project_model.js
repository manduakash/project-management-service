import pool from "../config/db.js";

class ProjectModel {

  static async save_project(projectId, projectType, projectPriority, projectStatus, projectName, entryUserId) {
    const connection = await pool.getConnection();
    try {
      projectId = projectId === undefined || projectId === null ? 0 : projectId;
      projectType = projectType || 0;
      projectPriority = projectPriority || 0;
      projectStatus = projectStatus || 0;
      projectName = projectName || "";
      entryUserId = entryUserId || 0;

      const params = [projectId, projectType, projectPriority, projectStatus, projectName, entryUserId];

      await connection.query(
        "CALL sp_saveProjectDetails(?, ?, ?, ?, ?, ?, @ErrorCode)",
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

  static async get_projects_by_user_id(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getProjectDetailsByUserID(?)",
        [userId]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async get_available_developers(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getAvailableDeveloperForProjectAssignment(?)",
        [userId]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async assign_user_to_project(userId, projectId) {
    const connection = await pool.getConnection();
    try {
      const params = [userId, projectId];

      await connection.query(
        "CALL sp_saveUserProjectDetails(?, ?, @ErrorCode)",
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
}

export default ProjectModel;
