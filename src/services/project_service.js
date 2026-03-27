import ProjectModel from "../models/project_model.js";

class ProjectService {
  static async save(projectData) {
    const {
      projectId = 0,
      projectType = 0,
      projectPriority = 0,
      projectStatus = 0,
      projectName = "",
      progressPercentage = 0,
      projectDeadline = null,
      entryUserId
    } = projectData;

    const errorCode = await ProjectModel.save_project(
      projectId,
      projectType,
      projectPriority,
      projectStatus,
      projectName || "",
      progressPercentage,
      projectDeadline,
      entryUserId
    );

    return errorCode;
  }

  static async getAll() {
    const rows = await ProjectModel.get_all_projects();
    return rows;
  }

  static async getByUserId(userId) {
    const rows = await ProjectModel.get_projects_by_user_id(userId);
    return rows;
  }

  static async getAvailableDevelopers(userId) {
    const rows = await ProjectModel.get_available_developers(userId);
    return rows;
  }

  static async assignUserToProject(userId, projectId) {
    const errorCode = await ProjectModel.assign_user_to_project(userId, projectId);
    return errorCode;
  }

  static async assignProjectLeadByAdmin(projectId, leadId, entryUserId) {
    const errorCode = await ProjectModel.assign_project_lead_by_admin(projectId, leadId, entryUserId);
    return errorCode;
  }

  static async deassignTeamLeadByAdmin(projectId, leadId, entryUserId) {
    const errorCode = await ProjectModel.deassign_team_lead_for_admin(projectId, leadId, entryUserId);
    return errorCode;
  }
}

export default ProjectService;
