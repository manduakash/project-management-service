import express from "express";
import authRoutes from "./routes/auth_routes.js";
import designationRoutes from "./routes/designation_routes.js";
import projectRoutes from "./routes/project_routes.js";
import taskRoutes from "./routes/task_routes.js";
import userRoutes from "./routes/user_routes.js";
import dashboardRoutes from "./routes/dashboard_routes.js";
import masterRoutes from "./routes/master_routes.js";
import authMiddleware from "./middleware/auth_middleware.js";
import authorize from "./middleware/authorization_middleware.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.use("/api/auth", authRoutes);

app.use("/api", authMiddleware);
app.use("/api/admin", authorize([1]));
app.use("/api/lead", authorize([2]));
app.use("/api/developer", authorize([3]));
app.use("/api/master", authorize([1, 2, 3]));

app.use("/api/developer/dashboard", dashboardRoutes);
app.use("/api/master", masterRoutes);

app.use("/api/designations", designationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// app.use("/api/admin", authorize(["admin"]), adminRoutes);



export default app;
