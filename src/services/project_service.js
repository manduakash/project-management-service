import ProjectModel from "../models/project_model.js";

class ProjectService {
  static async save(projectData) {
    const { projectId = 0, projectName = "", entryUserId } = projectData;

    const errorCode = await ProjectModel.save_project(
      projectId,
      projectName || "",
      entryUserId
    );

    return errorCode;
  }

  static async getAll() {
    const rows = await ProjectModel.get_all_projects();
    return rows;
  }
}

export default ProjectService;
