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
}

export default TaskService;
