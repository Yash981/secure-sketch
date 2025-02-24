import { WebSocket, WebSocketServer } from "ws";
import { VerifyUser } from "@repo/backend-common";
import { CollaborationManager, User } from "./managers/collaboration-manager";

const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server starting on ws://localhost:8080'); 
const collobrationManager = new CollaborationManager();
wss.on('listening', () => {
  console.log('WebSocket server is now running');
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
  const user = new User(ws, checkUserExist, checkUserExist.split('@')[0] as string);
  collobrationManager.addUser(user)
  ws.on("close", (event) => {
    console.log(event, "event");
    console.log("Client disconnected");
    collobrationManager.broadcastToRoom(JSON.stringify({ type: "USER_LEFT", payload: { userId: user.email } }), user.email);
    collobrationManager.removeUser(user.email)
  });
  ws.on("error", (err) => {
    console.error(err);
  });
});
