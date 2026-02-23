import TaskModel from "./src/models/task_model.js";
import TaskService from "./src/services/task_service.js";
import TaskController from "./src/controllers/task_controller.js";

async function verify() {
    console.log("Verifying exports and syntax...");

    if (typeof TaskModel.get_task_assignment_members !== 'function') {
        throw new Error("TaskModel.get_task_assignment_members is not a function");
    }
    console.log("- TaskModel.get_task_assignment_members OK");

    if (typeof TaskService.getAssignmentMembers !== 'function') {
        throw new Error("TaskService.getAssignmentMembers is not a function");
    }
    console.log("- TaskService.getAssignmentMembers OK");

    if (typeof TaskController.getAssignmentMembers !== 'function') {
        throw new Error("TaskController.getAssignmentMembers is not a function");
    }
    console.log("- TaskController.getAssignmentMembers OK");

    console.log("Syntax and exports verification PASSED.");
}

verify().catch(err => {
    console.error("Verification FAILED:", err);
    process.exit(1);
});
