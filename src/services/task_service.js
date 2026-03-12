import TaskModel from "../models/task_model.js";

class TaskService {
  static async saveTaskDetails(taskData) {
    const {
      taskId = 0,
      taskStatus = 0,
      taskTypeId = 0,
      projectId = 0,
      priority = 0,
      title = "",
      subTitle = "",
      taskDescription = "",
      progressPercentage = 0,
      deadline = null,
      assignedToUserId = 0,
      entryUserId = 0
    } = taskData;

    const errorCode = await TaskModel.save_task_details(
      taskId,
      taskStatus,
      taskTypeId,
      projectId,
      priority,
      title,
      subTitle,
      taskDescription,
      progressPercentage,
      deadline,
      assignedToUserId,
      entryUserId
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

  static async getAssignmentMembers(assignerId) {
    const rows = await TaskModel.get_task_assignment_members(assignerId);
    return rows;
  }

  static async updateStatus(taskId, status, isRejected, Remarks, priority, deadline, entryUserId) {
    const errorCode = await TaskModel.update_task_status(taskId, status, isRejected, Remarks, priority, deadline, entryUserId);
    return errorCode;
  }

  static async getAvailableDevelopersForTaskAssignment(userId, projectId) {
    const rows = await TaskModel.get_available_developers_for_task_assignment(userId, projectId);
    return rows;
  }

  static async getTaskDetailsByUserId(taskId, userId, projectId, taskStatusId, taskTypeId, taskPriority) {
    const rows = await TaskModel.get_task_details_by_user_id(taskId, userId, projectId, taskStatusId, taskTypeId, taskPriority);
    return rows;
  }

  static async remove(taskId, deleteUserId) {
    const errorCode = await TaskModel.remove_task_details(taskId, deleteUserId);
    return errorCode;
  }
}

export default TaskService;
