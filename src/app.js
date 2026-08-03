import express from "express";
import authRoutes from "./routes/auth_routes.js";
import designationRoutes from "./routes/designation_routes.js";
import projectRoutes from "./routes/project_routes.js";
import taskRoutes from "./routes/task_routes.js";
import userRoutes from "./routes/user_routes.js";
import profileRoutes from "./routes/profile_routes.js";
import dashboardRoutes from "./routes/dashboard_routes.js";
import salaryRoutes from "./routes/salary_routes.js";
import weekoffRoutes from "./routes/weekoff_routes.js";
import holidayRoutes from "./routes/holiday_routes.js";
import faceLoginLogsRoutes from "./routes/face_login_logs_routes.js";
import masterRoutes from "./routes/master_routes.js";
import slipRoutes from "./routes/payslip_routes.js";
import notificationRoutes from "./routes/notification_routes.js";
import attendanceRoutes from "./routes/attendance_routes.js";
import adminRoutes from "./routes/admin_routes.js";
import authMiddleware from "./middleware/auth_middleware.js";
import authorize from "./middleware/authorization_middleware.js";
import leaveRoutes from './routes/leave_application_routes.js';
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json({ limit: "20mb" }));
// app.use(express.static('public'));
app.use(express.static(join(__dirname, 'public')));
console.log('Static path:', join(__dirname, 'public'));
console.log('__dirname:', __dirname);

app.set('view engine', 'ejs');
// app.set('views', './src/views');
app.set('views', join(__dirname, './src/views'));

app.use(cors({
    origin: "*"
}));


app.use("/attendance-api/api/generate", slipRoutes);
app.use("/attendance-api/api/auth", authRoutes);
app.use("/attendance-api/api/accountant/face-login-logs", faceLoginLogsRoutes);
app.use("/attendance-api/api/users", userRoutes);
app.use("/attendance-api/api/master", masterRoutes);
// app.use("/attendance-api/api/master", authorize([1, 2, 3, 4, 5])); // kept if future roles need restriction

app.use("/api", authMiddleware);
app.use("/attendance-api/api/profile", profileRoutes);
app.use("/attendance-api/api/admin", authorize([1]));
app.use("/attendance-api/api/lead", authorize([2]));
app.use("/attendance-api/api/developer", authorize([3]));
app.use("/attendance-api/api/executive", authorize([1, 2, 3, 4, 5]));


app.use("/attendance-api/api/admin/dashboard", dashboardRoutes);
app.use("/attendance-api/api/admin", adminRoutes);
app.use("/attendance-api/api/developer/dashboard", dashboardRoutes);
app.use("/attendance-api/api/lead/dashboard", dashboardRoutes);

app.use("/attendance-api/api/designations", designationRoutes);
app.use("/attendance-api/api/projects", projectRoutes);
app.use("/attendance-api/api/tasks", taskRoutes);
app.use("/attendance-api/api/notifications", notificationRoutes);
app.use("/attendance-api/api/attendance", attendanceRoutes);

// app.use("/attendance-api/api/admin", authorize(["admin"]), adminRoutes);
// app.use("/attendance-api/api/admin", authorize(["admin"]), adminRoutes);
app.use("/attendance-api/api/executive/dashboard", dashboardRoutes);
app.use("/attendance-api/api/accountant/dashboard", dashboardRoutes);
app.use("/attendance-api/api/accountant/salary", salaryRoutes);
app.use("/attendance-api/api/accountant/weekoffs", weekoffRoutes);
app.use("/attendance-api/api/accountant/holidays", holidayRoutes);
app.use("/attendance-api/api/accountant/holidays", holidayRoutes);
app.use('/attendance-api/api/leave', leaveRoutes);



export default app;
