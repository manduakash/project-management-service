import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth_routes.js";
import designationRoutes from "./routes/designation_routes.js";
import projectRoutes from "./routes/project_routes.js";
import taskRoutes from "./routes/task_routes.js";
import authMiddleware from "./middleware/auth_middleware.js";

dotenv.config();

const app = express();

app.use(express.json());



app.use("/api/auth", authRoutes);

// Protect all /api routes after the auth routes are mounted. Public auth endpoints
// (e.g. /api/auth/register, /api/auth/login) are mounted above.
app.use("/api", authMiddleware);

app.use("/api/designations", designationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
