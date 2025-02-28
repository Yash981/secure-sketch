import { ClientMessage, EventTypes } from "@repo/backend-common";
import { randomUUID } from "crypto";
import { WebSocket } from "ws";

export interface UserPresence {
  cursor: {
    x: number;
    y: number;
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export class User {
  public socket: WebSocket;
  public email: string;
  public id: string;
  public displayName: string;
  public presence: UserPresence;
  public lastActiveAt: number;
  public color?: string;
  public encryptedData?: string;

  constructor(
    socket: WebSocket,
    email: string,
    displayName: string,
    initialPresence?: Partial<UserPresence>
  ) {
    this.socket = socket;
    this.email = email;
    this.id = randomUUID();
    this.displayName = displayName;
    this.lastActiveAt = Date.now();
    this.color = this.generateColor();
    this.presence = {
      cursor: {
        x: initialPresence?.cursor?.x ?? 0,
        y: initialPresence?.cursor?.y ?? 0,
      },
      selection: initialPresence?.selection,
    };
  }
  private generateColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 90%, 70%)`;
  }
  updatePresence(presence: Partial<UserPresence>) {
    this.presence = { ...this.presence, ...presence };
    this.lastActiveAt = Date.now();
  }
}

export class CollaborationManager {
  private rooms: Map<string, User[]>; // roomId --> User[]
  private users: User[];
  constructor() {
    this.rooms = new Map();
    this.users = [];
  }
  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }

  removeUser(userId: string) {
    for (const [roomId, users] of this.rooms.entries()) {
      const updatedUsers = users.filter((u) => u.id !== userId);

      if (updatedUsers.length === 0) {
        this.rooms.delete(roomId);
      } else {
        this.rooms.set(roomId, updatedUsers);
      }
    }
    this.users = this.users.filter((u) => u.email !== userId);
  }

  getUsersInRoom(roomId: string): User[] {
    return this.rooms.get(roomId) || [];
  }

  updateUserPresence(userId: string, presence: Partial<UserPresence>) {
    for (const users of this.rooms.values()) {
      const user = users.find((u) => u.email === userId);
      if (user) {
        user.updatePresence(presence);
      }
    }
  }

  broadcastToRoom(message: any, excludeUserId?: string,roomId?: string) {
    console.log('broadcasting to room', message, excludeUserId, roomId);
    let currentRoomId = roomId || null;
    if (!currentRoomId) {
      for (const [key, value] of this.rooms.entries()) {
        if (value.find((user) => user.email === excludeUserId)) {
          currentRoomId = key;
          break;
        }
      }
    }
    if (!currentRoomId) return;
    const users = this.rooms.get(currentRoomId) || [];
    console.log(users, 'users');
    for (const user of users) {
      if (excludeUserId && user.email !== excludeUserId) {
        console.log('sending message to user', user.email);
        user.socket.send(message);
      }
    }
  }
  private addHandler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString()) as ClientMessage;
      if (message.type === EventTypes.CREATE_ROOM) {
        const { roomId }: { roomId: string } = message.payload;
        this.rooms.set(roomId, [user]);
        user.socket.send(
          JSON.stringify({ type: EventTypes.ROOM_CREATED, roomId })
        );
      }else if (message.type === EventTypes.JOIN_ROOM) {
        const { roomId }: { roomId: string } = message.payload;
      
        if (this.rooms.has(roomId)) {
          const room = this.rooms.get(roomId) || [];
      
          console.log(room.length, "before length of room", room);
      
          const existingUserIndex = room.findIndex((u) => u.email === user.email);
      
          if (existingUserIndex !== -1) {
            room[existingUserIndex] = user;
          } else {
            room.push(user);
          }
      
          this.rooms.set(roomId, room);
      
          console.log(this.rooms.get(roomId)?.length, "length of room");
      
          user.socket.send(
            JSON.stringify({ type: EventTypes.JOINED_ROOM, roomId })
          );
      
          this.broadcastToRoom(
            JSON.stringify({
              type: EventTypes.USER_JOINED,
              message: `${user.email} has joined`,
            }),
            user.id,
            roomId
          );
      
        } else {
          user.socket.send(
            JSON.stringify({
              type: EventTypes.ERROR,
              message: "Room does not exist.",
            })
          );
        }
      }
       else if (message.type === EventTypes.CURSOR_MOVE) {
        const { roomId, cursor } = message.payload;

        this.updateUserPresence(user.email, { cursor });

        this.broadcastToRoom(
          JSON.stringify({
            type: EventTypes.CURSOR_MOVED,
            userId: user.email,
            cursor,
            color: user.color,
            displayName: user.displayName,
          }),
          user.email,
          roomId,
        );
      } else if (message.type === EventTypes.SEND_ENCRYPTED_DATA) {
        const { roomId, encryptedData } = message.payload;
        console.log(encryptedData,'encryptedData on server');
        this.broadcastToRoom(
          JSON.stringify({
            type: EventTypes.RECEIVE_ENCRYPTED_DATA,
            userId: user.email,
            encryptedData,
          }),
          user.email,
          roomId,
        );
      }
    });
  }
}
