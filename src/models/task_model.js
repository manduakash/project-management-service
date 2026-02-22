import pool from "../config/db.js";

class TaskModel {

  static async save_task(
    taskId,
    statusId,
    typeId,
    projectId,
    priorityId,
    assignedByUserId,
    assignedToUsers,
    title,
    subTitle,
    description,
    progressPercentage,
    deadline,
    entryUser
  ) {
    const connection = await pool.getConnection();
    try {
      taskId = taskId === undefined || taskId === null ? 0 : taskId;
      statusId = statusId || 0;
      typeId = typeId || 0;
      projectId = projectId || 0;
      priorityId = priorityId || 0;
      assignedByUserId = assignedByUserId || 0;
      assignedToUsers = assignedToUsers || JSON.stringify([]);
      title = title || "";
      subTitle = subTitle || "";
      description = description || "";
      progressPercentage = progressPercentage || 0;
      deadline = deadline || null;
      entryUser = entryUser || "system";

      const params = [
        taskId,
        statusId,
        typeId,
        projectId,
        priorityId,
        assignedByUserId,
        assignedToUsers,
        title,
        subTitle,
        description,
        progressPercentage,
        deadline,
        entryUser
      ];

      await connection.query(
        "CALL sp_saveUserTaskDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)",
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
}

export default TaskModel;

