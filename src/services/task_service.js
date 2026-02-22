import TaskModel from "../models/task_model.js";

class TaskService {
  static async save(taskData) {
    const {
      taskId = 0,
      statusId = 0,
      typeId = 0,
      projectId = 0,
      priorityId = 0,
      assignedByUserId = 0,
      assignedToUsers = JSON.stringify([]),
      title = "",
      subTitle = "",
      description = "",
      progressPercentage = 0,
      deadline = null,
      entryUser = ""
    } = taskData;

    const errorCode = await TaskModel.save_task(
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
    );

    return errorCode;
  }

  static async get(filters) {
    const {
      taskId = 0,
      assignedByUserId = 0,
      assignedToUserId = 0,
      projectId = 0,
      taskStatus = 0,
      taskTypeId = 0,
      taskPriority = 0,
    } = filters || {};

    const rows = await TaskModel.get_task_details(
      Number(taskId) || 0,
      Number(assignedByUserId) || 0,
      Number(assignedToUserId) || 0,
      Number(projectId) || 0,
      Number(taskStatus) || 0,
      Number(taskTypeId) || 0,
      Number(taskPriority) || 0
    );

    return rows;
  }
}

export default TaskService;
