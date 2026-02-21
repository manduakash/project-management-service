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
}

export default TaskModel;
