import express from 'express';
import { LeaveApplicationController } from '../controllers/leave_application_controller.js';

const router = express.Router();

router.get('/',      LeaveApplicationController.getAll);
router.put('/:id',   LeaveApplicationController.update);
router.delete('/:id', LeaveApplicationController.remove);

export default router;