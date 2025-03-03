import express from "express";
import UserRouter from "./routes/v1/user-router";
import cookieParser from "cookie-parser";
import http from 'http'
import dotenv from "dotenv";
import cors from 'cors'
import { setupWebSocketServer} from '@repo/ws'

dotenv.config({path: "../../.env"});
const PORT = process.env.PORT || 9000
const app = express()
app.use(express.json())
app.use(express.raw({ type: "application/octet-stream", limit: "10mb" }));
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
  }))
app.use('/api/v1',UserRouter) 
const server = http.createServer(app);
setupWebSocketServer(server);

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});