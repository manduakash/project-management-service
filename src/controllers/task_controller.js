import TaskService from "../services/task_service.js";
import response from "../utils/response.js";

class TaskController {
  static async saveTaskDetails(req, res) {
    try {
      const taskId = req.body.taskId ?? req.body.TaskID ?? 0;
      const taskStatus = req.body.taskStatus ?? req.body.TaskStatus;
      const taskTypeId = req.body.taskTypeId ?? req.body.TaskTypeID;
      const projectId = req.body.projectId ?? req.body.ProjectID;
      const priority = req.body.priority ?? req.body.Priority;
      const title = req.body.title ?? req.body.Title;
      const subTitle = req.body.subTitle ?? req.body.SubTitle;
      const taskDescription = req.body.taskDescription ?? req.body.TaskDescription ?? req.body.description ?? req.body.Description;
      const progressPercentage = req.body.progressPercentage ?? req.body.ProgressPercentage;
      const deadline = req.body.deadline ?? req.body.Deadline;
      const assignedToUserId = req.body.assignedToUserId ?? req.body.AssignedToUserID;

      // Required field validation
      const missing = [];
      if (taskStatus === undefined) missing.push("TaskStatus");
      if (taskTypeId === undefined) missing.push("TaskTypeID");
      if (projectId === undefined) missing.push("ProjectID");
      if (priority === undefined) missing.push("Priority");
      if (title === undefined) missing.push("Title");
      if (subTitle === undefined) missing.push("SubTitle");
      if (taskDescription === undefined) missing.push("TaskDescription");
      if (progressPercentage === undefined) missing.push("ProgressPercentage");
      if (deadline === undefined) missing.push("Deadline");
      if (assignedToUserId === undefined) missing.push("AssignedToUserID");

      if (missing.length > 0) {
        return response.error(res, `missing parameters: ${missing.join(", ")}`, 400);
      }

      if (String(title).trim() === "") return response.error(res, "Title cannot be empty", 400);
      if (String(subTitle).trim() === "") return response.error(res, "SubTitle cannot be empty", 400);
      if (String(taskDescription).trim() === "") return response.error(res, "TaskDescription cannot be empty", 400);

      const progressNum = Number(progressPercentage);
      if (!Number.isInteger(progressNum) || progressNum < 0 || progressNum > 100) {
        return response.error(res, "ProgressPercentage must be an integer between 0 and 100", 400);
      }

      if (!deadline) return response.error(res, "Deadline cannot be empty", 400);
      const dl = Date.parse(deadline);
      if (Number.isNaN(dl)) return response.error(res, "Deadline must be a valid date", 400);

      // EntryUserID comes from JWT
      const entryUserId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!entryUserId) return response.error(res, "invalid token: missing user information", 401);

      const errorCode = await TaskService.saveTaskDetails({
        taskId: Number(taskId),
        taskStatus: Number(taskStatus),
        taskTypeId: Number(taskTypeId),
        projectId: Number(projectId),
        priority: Number(priority),
        title: String(title).trim(),
        subTitle: String(subTitle).trim(),
        taskDescription: String(taskDescription),
        progressPercentage: progressNum,
        deadline: new Date(dl).toISOString().slice(0, 10),
        assignedToUserId: Number(assignedToUserId),
        entryUserId: Number(entryUserId)
      });

      if (errorCode === 0) {
        const message = Number(taskId) === 0 ? "Task created successfully" : "Task updated successfully";
        return response.success(res, null, message, 200);
      }

      if (errorCode === 3) {
        return response.error(res, "invalid task id", 400);
      }

      return response.error(res, "failed to save task", 500);
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  }

  static async get(req, res) {
    try {
      // Accept filters from query string or body
      const src = Object.keys(req.query).length ? req.query : req.body;

      const taskId = src.taskId ?? src.TaskID ?? 0;
      const assignedByUserId = src.assignedByUserId ?? src.AssignedByUserID ?? 0;
      const assignedToUserId = src.assignedToUserId ?? src.AssignedToUserID ?? 0;
      const projectId = src.projectId ?? src.ProjectID ?? 0;
      const taskStatus = src.taskStatus ?? src.TaskStatus ?? 0;
      const taskTypeId = src.taskTypeId ?? src.TaskTypeID ?? 0;
      const taskPriority = src.taskPriority ?? src.TaskPriority ?? 0;

      const rows = await TaskService.get({
        taskId,
        assignedByUserId,
        assignedToUserId,
        projectId,
        taskStatus,
        taskTypeId,
        taskPriority,
      });

      // Each task has a single assigned user — return a flat response
      const data = rows.map(r => ({
        TaskID: r.TaskID,
        StatusID: r.StatusID,
        StatusName: r.StatusName,
        TypeID: r.TypeID,
        TypeName: r.TypeName,
        ProjectID: r.ProjectID,
        ProjectName: r.ProjectName,
        PriorityID: r.PriorityID,
        PriorityName: r.PriorityName,
        AssignedByUserID: r.AssignedByUserID,
        AssignedByUserFullName: r.AssignedByUserFullName,
        AssignedToUserID: r.AssignedToUserID ?? null,
        AssignedToUserFullName: r.AssignedToUserFullName ?? null,
        Title: r.Title,
        SubTitle: r.SubTitle,
        Description: r.Description,
        ProgressPercentage: r.ProgressPercentage,
        Deadline: r.Deadline
      }));

      return response.success(res, data, "tasks fetched", 200);
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  }

  static async getAssignmentMembers(req, res) {
    try {
      const assignerId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!assignerId) {
        return response.error(res, "invalid token: missing user information", 401);
      }

      const rows = await TaskService.getAssignmentMembers(assignerId);
      return response.success(res, rows, "assignment members fetched", 200);
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  }

  static async updateStatus(req, res) {
    try {
      const taskId = req.body.TaskID ?? req.body.taskId;
      const status = req.body.TaskStatus ?? req.body.status;
      const priority = req.body.TaskPriority ?? req.body.priority;
      const deadline = req.body.TaskDeadline ?? req.body.deadline;

      if (!taskId || status === undefined || priority === undefined || !deadline) {
        return response.error(res, "missing parameters: TaskID, TaskStatus, TaskPriority, and TaskDeadline are required", 400);
      }

      const entryUserId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!entryUserId) {
        return response.error(res, "invalid token: missing user information", 401);
      }

      const errorCode = await TaskService.updateStatus(taskId, status, priority, deadline, entryUserId);

      if (errorCode === 0) {
        return response.success(res, null, "Task status updated successfully", 200);
      }

      return response.error(res, "failed to update task status", 500);
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  }

  static async getAvailableDevelopers(req, res) {
    try {
      const userId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!userId) {
        return response.error(res, "invalid token: missing user information", 401);
      }

      const projectId = req.query.projectId ?? req.query.ProjectID;
      if (!projectId) {
        return response.error(res, "missing parameter: projectId is required", 400);
      }

      const data = await TaskService.getAvailableDevelopersForTaskAssignment(userId, projectId);
      return response.success(res, data, "available developers for task assignment fetched", 200);
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  }

  static async getTaskDetailsByUserId(req, res) {
    try {
      const userId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!userId) {
        return response.error(res, "invalid token: missing user information", 401);
      }

      const src = Object.keys(req.query).length ? req.query : req.body;

      const taskId = Number(src.taskId ?? src.TaskID ?? 0);
      const projectId = Number(src.projectId ?? src.ProjectID ?? 0);
      const taskStatusId = Number(src.taskStatusId ?? src.TaskStatusID ?? 0);
      const taskTypeId = Number(src.taskTypeId ?? src.TaskTypeID ?? 0);
      const taskPriority = Number(src.taskPriority ?? src.TaskPriority ?? 0);

      const data = await TaskService.getTaskDetailsByUserId(
        taskId,
        userId,
        projectId,
        taskStatusId,
        taskTypeId,
        taskPriority
      );

      return response.success(res, data, "task details fetched", 200);
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  }
}

export default TaskController;
