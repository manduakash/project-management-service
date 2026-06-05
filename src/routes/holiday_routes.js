// ─── Holidays ────────────────────────────────────────────────
import HolidayController from "../controllers/holiday_controller.js";

const holidayRouter = express.Router();

// Base: /api/accountant/holidays
holidayRouter.get("/", HolidayController.getAll);
holidayRouter.get("/:id", HolidayController.getById);
holidayRouter.post("/", HolidayController.insert);
holidayRouter.put("/:id", HolidayController.update);
holidayRouter.delete("/:id", HolidayController.delete);

export default holidayRouter;