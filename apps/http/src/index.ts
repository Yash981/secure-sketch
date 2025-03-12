import express from "express";
import UserRouter from "./routes/v1/user-router";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../../.env" });
const PORT = process.env.PORT || 9000;
const app = express();
app.use(express.json());
app.use(express.raw({ type: "application/octet-stream", limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use("/api/v1", UserRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
