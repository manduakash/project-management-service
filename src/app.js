import express from "express";
import authRoutes from "./routes/auth_routes.js";
import designationRoutes from "./routes/designation_routes.js";
import projectRoutes from "./routes/project_routes.js";
import taskRoutes from "./routes/task_routes.js";
import userRoutes from "./routes/user_routes.js";
import authMiddleware from "./middleware/auth_middleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", authMiddleware);

app.use("/api/designations", designationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

export default app;
