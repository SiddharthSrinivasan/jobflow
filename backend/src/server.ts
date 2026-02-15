import express from "express" 
import cors from "cors";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import dotenv from "dotenv";
import { requireAuth, AuthRequest } from "./middleware/requireAuth";

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
dotenv.config();

app.get("/health", (req, res) => {
    res.json({ status: "ok"});
});
app.get("/me", requireAuth, (req: AuthRequest, res) => {
  res.json({ userId: req.userId });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})