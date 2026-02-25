import ProjectModel from "../models/project_model.js";

class ProjectService {
  static async save(projectData) {
    const { projectId = 0, projectType = 0, projectPriority = 0, projectStatus = 0, projectName = "", entryUserId } = projectData;

    const errorCode = await ProjectModel.save_project(
      projectId,
      projectType,
      projectPriority,
      projectStatus,
      projectName || "",
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
}

export default ProjectService;
