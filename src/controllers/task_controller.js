import TaskService from "../services/task_service.js";
import response from "../utils/response.js";

class TaskController {
  static async save(req, res) {
    try {
      const taskId = req.body.taskId ?? req.body.TaskID;
      const statusId = req.body.statusId ?? req.body.StatusID;
      const typeId = req.body.typeId ?? req.body.TypeID;
      const projectId = req.body.projectId ?? req.body.ProjectID;
      const priorityId = req.body.priorityId ?? req.body.PriorityID;
      const assignedByUserId = req.body.assignedByUserId ?? req.body.AssignedByUserID;
      const assignedToUsers = req.body.assignedToUsers ?? req.body.AssignedToUsers;
      const title = req.body.title ?? req.body.Title;
      const subTitle = req.body.subTitle ?? req.body.SubTitle;
      const description = req.body.description ?? req.body.Description;
      const progressPercentage = req.body.progressPercentage ?? req.body.ProgressPercentage;
      const deadline = req.body.deadline ?? req.body.Deadline;

      // Validate presence of all parameters required by the stored procedure
      const missing = [];
      if (taskId === undefined) missing.push("TaskID");
      if (statusId === undefined) missing.push("StatusID");
      if (typeId === undefined) missing.push("TypeID");
      if (projectId === undefined) missing.push("ProjectID");
      if (priorityId === undefined) missing.push("PriorityID");
      if (assignedByUserId === undefined) missing.push("AssignedByUserID");
      if (assignedToUsers === undefined) missing.push("AssignedToUsers");
      if (title === undefined) missing.push("Title");
      if (subTitle === undefined) missing.push("SubTitle");
      if (description === undefined) missing.push("Description");
      if (progressPercentage === undefined) missing.push("ProgressPercentage");
      if (deadline === undefined) missing.push("Deadline");

      if (missing.length > 0) {
        return response.error(res, `missing parameters: ${missing.join(", ")}`, 400);
      }

      // Additional validations
      if (String(title).trim() === "") return response.error(res, "Title cannot be empty", 400);
      if (String(subTitle).trim() === "") return response.error(res, "SubTitle cannot be empty", 400);
      if (String(description).trim() === "") return response.error(res, "Description cannot be empty", 400);

      // progress must be integer 1-100
      const progressNum = Number(progressPercentage);
      if (!Number.isInteger(progressNum) || progressNum < 1 || progressNum > 100) {
        return response.error(res, "ProgressPercentage must be an integer between 1 and 100", 400);
      }

      // assignedToUsers must be array or valid JSON
      let assignedToJson = assignedToUsers;
      if (Array.isArray(assignedToUsers)) {
        assignedToJson = JSON.stringify(assignedToUsers);
      } else if (typeof assignedToUsers === "string") {
        try {
          const parsed = JSON.parse(assignedToUsers);
          if (!Array.isArray(parsed)) return response.error(res, "AssignedToUsers must be a JSON array", 400);
          assignedToJson = JSON.stringify(parsed);
        } catch (err) {
          return response.error(res, "AssignedToUsers must be valid JSON", 400);
        }
      } else {
        return response.error(res, "AssignedToUsers must be a JSON array", 400);
      }

      // deadline should be a valid date string (YYYY-MM-DD or ISO)
      if (deadline === null || deadline === "") {
        return response.error(res, "Deadline cannot be empty", 400);
      }
      const dl = Date.parse(deadline);
      if (Number.isNaN(dl)) return response.error(res, "Deadline must be a valid date", 400);

      // Entry user from token (mandatory)
      const entryUser = String(req.user?.UserID ?? req.user?.UserId ?? req.user?.Username ?? "");
      if (!entryUser) return response.error(res, "invalid token: missing user information", 401);

      const errorCode = await TaskService.save({
        taskId: Number(taskId),
        statusId: Number(statusId),
        typeId: Number(typeId),
        projectId: Number(projectId),
        priorityId: Number(priorityId),
        assignedByUserId: Number(assignedByUserId),
        assignedToUsers: assignedToJson,
        title: String(title).trim(),
        subTitle: String(subTitle).trim(),
        description: String(description),
        progressPercentage: progressNum,
        deadline: new Date(dl).toISOString().slice(0, 10),
        entryUser
      });

      if (errorCode === 0) {
        const message = taskId === 0 ? "Task created successfully" : "Task updated successfully";
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

      // Group rows by TaskID and aggregate assigned-to fields into arrays
      const grouped = [];
      const map = new Map();

      for (const r of rows) {
        const id = r.TaskID;
        if (!map.has(id)) {
          const base = {
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
            AssignedToUsers: [],
            Title: r.Title,
            SubTitle: r.SubTitle,
            Description: r.Description,
            ProgressPercentage: r.ProgressPercentage,
            Deadline: r.Deadline
          };
          map.set(id, base);
          grouped.push(base);
        }

        const entry = map.get(id);
        // push assigned-to object if present and not already included
        if (r.AssignedToUserID !== undefined && r.AssignedToUserID !== null) {
          const aid = Number(r.AssignedToUserID);
          const name = r.AssignedToUserFullName !== undefined && r.AssignedToUserFullName !== null ? String(r.AssignedToUserFullName) : null;
          const exists = entry.AssignedToUsers.some(u => u.AssignedToUserID === aid);
          if (!exists) entry.AssignedToUsers.push({ AssignedToUserID: aid, AssignedToUserFullName: name });
        }
      }

      return response.success(res, grouped, "tasks fetched", 200);
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
}

export default TaskController;
