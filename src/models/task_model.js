import pool from "../config/db.js";

class TaskModel {

  static async save_task_details(taskId, taskStatus, taskTypeId, projectId, priority, title, subTitle, taskDescription, progressPercentage, deadline, assignedToUserId, entryUserId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "CALL sp_saveTaskDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)",
        [
          taskId || 0,
          taskStatus || 0,
          taskTypeId || 0,
          projectId || 0,
          priority || 0,
          title || "",
          subTitle || "",
          taskDescription || "",
          progressPercentage || 0,
          deadline || null,
          assignedToUserId || 0,
          entryUserId || 0
        ]
      );
      const [[{ ErrorCode }]] = await connection.query("SELECT @ErrorCode AS ErrorCode");
      return ErrorCode;
    } finally {
      connection.release();
    }
  }

  static async get_task_details(taskId, assignedByUserId, assignedToUserId, projectId, taskStatus, taskTypeId, taskPriority) {
    const connection = await pool.getConnection();
    try {
      taskId = taskId === undefined || taskId === null ? 0 : taskId;
      assignedByUserId = assignedByUserId === undefined || assignedByUserId === null ? 0 : assignedByUserId;
      assignedToUserId = assignedToUserId === undefined || assignedToUserId === null ? 0 : assignedToUserId;
      projectId = projectId === undefined || projectId === null ? 0 : projectId;
      taskStatus = taskStatus === undefined || taskStatus === null ? 0 : taskStatus;
      taskTypeId = taskTypeId === undefined || taskTypeId === null ? 0 : taskTypeId;
      taskPriority = taskPriority === undefined || taskPriority === null ? 0 : taskPriority;

      const params = [
        taskId,
        assignedByUserId,
        assignedToUserId,
        projectId,
        taskStatus,
        taskTypeId,
        taskPriority,
      ];

      const [rows] = await connection.query(
        "CALL sp_getTaskDetails(?, ?, ?, ?, ?, ?, ?)",
        params
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async get_task_assignment_members(assignerId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getMembersForTaskAssignmentDetails(?)",
        [assignerId || 0]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async update_task_status(taskId, status, priority, deadline, entryUserId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "CALL sp_updateTaskStatus(?, ?, ?, ?, ?, @ErrorCode)",
        [taskId, status, priority, deadline, entryUserId]
      );
      const [[{ ErrorCode }]] = await connection.query("SELECT @ErrorCode AS ErrorCode");
      return ErrorCode;
    } finally {
      connection.release();
    }
  }

  static async get_available_developers_for_task_assignment(userId, projectId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getAvailableDeveloperForTaskAssignment(?, ?)",
        [userId || 0, projectId || 0]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async get_task_details_by_user_id(taskId, userId, projectId, taskStatusId, taskTypeId, taskPriority) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "CALL sp_getTaskDetailsByUserID(?, ?, ?, ?, ?, ?)",
        [taskId || 0, userId || 0, projectId || 0, taskStatusId || 0, taskTypeId || 0, taskPriority || 0]
      );
      return rows[0] || [];
    } finally {
      connection.release();
    }
  }

  static async remove_task_details(taskId, deleteUserId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "CALL sp_removeTaskDetails(?, ?, @ErrorCode)",
        [taskId, deleteUserId]
      );
      const [[{ ErrorCode }]] = await connection.query("SELECT @ErrorCode AS ErrorCode");
      return ErrorCode;
    } finally {
      connection.release();
    }
  }
}

export default TaskModel;

