import { WebSocket, WebSocketServer } from "ws";
import { VerifyUser } from "@repo/backend-common";
import { CollaborationManager, User } from "./managers/collaboration-manager";
import express from 'express'
import http from 'http'
import cors from 'cors';
const app = express()
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://secure-sketch.vercel.app',
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization","Set-Cookie"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Set-cookie"],
  })
)
app.get('/cronjob',(req,res)=>{
  res.status(200).send("Cronjob running successfully")
})
// // Create HTTP server without Express
// const server = http.createServer((req, res) => {
//   // Handle the cronjob endpoint
//   if (req.url === '/cronjob' && req.method === 'GET') {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Cronjob running successfully');
//     return;
//   }
  
//   // Handle other HTTP requests or 404
//   res.writeHead(404, { 'Content-Type': 'text/plain' });
//   res.end('Not found');
// });
const PORT = Number(process.env.PORT) || 8080;
const server = http.createServer(app)

const wss = new WebSocketServer({ server });

const collobrationManager = new CollaborationManager();

server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running on port ${PORT}`);
});

wss.on("listening", () => {
  console.log("WebSocket server is now running");
});

wss.on("connection", function connection(ws: WebSocket, req) {
  const url = req.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const checkUserExist = VerifyUser(token);
  if (checkUserExist == null) {
    ws.close();
    return null;
  }
  const user = new User(
    ws,
    checkUserExist,
    checkUserExist.split("@")[0] as string
  );
  collobrationManager.addUser(user);
  ws.on("close", (event) => {
    console.log("Client disconnected");
    collobrationManager.broadcastToRoom(
      JSON.stringify({ type: "USER_LEFT", payload: { userId: user.email } }),
      user.email
    );
    collobrationManager.removeUser(user.email);
  });
  ws.on("error", (err) => {
    console.error(err);
    ws.send(JSON.stringify({ err }));
  });
});
