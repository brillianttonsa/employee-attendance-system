import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

import authRouter from "./routes/admin/auth.js";
import workersRouter from "./routes/admin/workers.js";
import departmentsRouter from "./routes/admin/departments.js";
import sessionsRouter from "./routes/admin/sessions.js";
import attendancesRouter from "./routes/admin/attendances.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/workers", workersRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/attendances", attendancesRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`EAS backend listening on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});

export default app;
