import { WebSocket, WebSocketServer } from "ws";
import { VerifyUser } from "@repo/backend-common";
import { CollaborationManager, User } from "./managers/collaboration-manager";
import express from 'express'
import http from 'http'

const app = express()
app.get('/cronjob',(req,res)=>{
  res.status(200).send("Cronjob running successfully")
})

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
    console.log(event, "event");
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
