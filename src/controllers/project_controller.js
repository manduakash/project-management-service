import ProjectService from "../services/project_service.js";
import response from "../utils/response.js";

class ProjectController {
  static async save(req, res) {
    try {
      const projectId = Number(req.body.projectId ?? req.body.ProjectID ?? 0);
      const projectType = Number(req.body.projectType ?? req.body.ProjectType ?? 0);
      const projectPriority = Number(req.body.projectPriority ?? req.body.ProjectPriority ?? 0);
      const projectStatus = Number(req.body.projectStatus ?? req.body.ProjectStatus ?? 0);
      const projectName = req.body.projectName ?? req.body.ProjectName;

      if (!projectName || String(projectName).trim() === "") {
        return response.error(res, "missing parameters: projectName", 400);
      }

      const entryUserId = req.user?.UserID ?? req.user?.UserId ?? req.user?.user_id ?? null;
      if (!entryUserId) {
        return response.error(res, "invalid token: missing user id", 401);
      }

      const errorCode = await ProjectService.save({
        projectId,
        projectType,
        projectPriority,
        projectStatus,
        projectName: String(projectName).trim(),
        entryUserId,
      });

      if (errorCode === 0) {
        const message = projectId === 0 ? "Project created successfully" : "Project updated successfully";
        return response.success(res, null, message, 200);
      }

      if (errorCode === 3) {
        return response.error(res, "invalid project id", 400);
      }

      return response.error(res, "failed to save project", 500);
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }

  static async getAll(req, res) {
    try {
      const data = await ProjectService.getAll();
      return response.success(res, data, "projects fetched", 200);
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }

  static async getByUser(req, res) {
    try {
      const userId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!userId) {
        return response.error(res, "invalid token: missing user information", 401);
      }

      const data = await ProjectService.getByUserId(userId);
      return response.success(res, data, "projects fetched", 200);
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }

  static async getAvailableDevelopers(req, res) {
    try {
      const userId = req.user?.UserID ?? req.user?.UserId ?? req.user?.ua_id;
      if (!userId) {
        return response.error(res, "invalid token: missing user information", 401);
      }

      const data = await ProjectService.getAvailableDevelopers(userId);
      return response.success(res, data, "available developers fetched", 200);
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }

  static async assignUser(req, res) {
    try {
      const userId = req.body.userId ?? req.body.UserID;
      const projectId = req.body.projectId ?? req.body.ProjectID;

      if (!userId || !projectId) {
        return response.error(res, "missing parameters: userId and projectId are required", 400);
      }

      const errorCode = await ProjectService.assignUserToProject(userId, projectId);

      if (errorCode === 0) {
        return response.success(res, null, "User assigned to project successfully", 201);
      } else if (errorCode === 2) {
        return response.error(res, "User is already assigned to this project", 400);
      } else {
        return response.error(res, "Failed to assign user to project", 500);
      }
    } catch (error) {
      return response.error(res, error.message, 500);
    }
  }
}

export default ProjectController;
