import { LeaveApplicationService } from '../services/leave_application_service.js';
import response from '../utils/response.js';

export class LeaveApplicationController {

    static async getAll(req, res) {
        try {
            const { user_id, month, year } = req.query;
            const data = await LeaveApplicationService.getAll({ user_id, month, year });
            return response.success(res, data, 'Leave applications fetched successfully');
        } catch (err) {
            return response.error(res, err.message, err.statusCode || 500);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const message = await LeaveApplicationService.update(id, req.body);
            return response.success(res, null, message);
        } catch (err) {
            return response.error(res, err.message, err.statusCode || 500);
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const { updated_by } = req.body;
            const message = await LeaveApplicationService.remove(id, updated_by);
            return response.success(res, null, message);
        } catch (err) {
            return response.error(res, err.message, err.statusCode || 500);
        }
    }
}