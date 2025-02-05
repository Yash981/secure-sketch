import { WebSocket, WebSocketServer } from "ws";
import {  VerifyUser } from "@repo/backend-common";
import { User } from "./managers/collaboration-manager";

export const setupWebsocketServer = () => {
  const wss = new WebSocketServer({ port: 8080 });
  wss.on("connection", async function connection(ws:WebSocket, req) {
    const url = req.url;
    if (!url) {
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const checkUserExist = VerifyUser(token)
    if (checkUserExist == null) {
      ws.close()
      return null;
    }
    const user = new User(ws,checkUserExist)
  });
};
