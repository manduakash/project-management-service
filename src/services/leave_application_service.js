import { LeaveApplicationModel } from '../models/leave_application_model.js';

export class LeaveApplicationService {

    static async getAll({ user_id, month, year }) {
        const data = await LeaveApplicationModel.getAll({ user_id, month, year });
        return data;
    }

    static async update(ulad_id, body) {
        if (!ulad_id) {
            const err = new Error('Leave application ID is required');
            err.statusCode = 400;
            throw err;
        }

        if (!body.updated_by) {
            const err = new Error('updated_by is required');
            err.statusCode = 400;
            throw err;
        }

        const message = await LeaveApplicationModel.update(ulad_id, body);

        if (message !== 'Leave application updated successfully') {
            const err = new Error(message);
            err.statusCode = 404;
            throw err;
        }

        return message;
    }

    static async remove(ulad_id, updated_by) {
        if (!ulad_id) {
            const err = new Error('Leave application ID is required');
            err.statusCode = 400;
            throw err;
        }

        if (!updated_by) {
            const err = new Error('updated_by is required');
            err.statusCode = 400;
            throw err;
        }

        const message = await LeaveApplicationModel.remove(ulad_id, updated_by);

        if (message !== 'Leave application deleted successfully') {
            const err = new Error(message);
            err.statusCode = 404;
            throw err;
        }

        return message;
    }
}