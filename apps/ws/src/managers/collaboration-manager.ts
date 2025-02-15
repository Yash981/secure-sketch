import { ClientMessage, EventTypes } from '@repo/backend-common';
import { randomUUID} from 'crypto'
import { WebSocket } from 'ws';

export interface UserPresence {
  cursor: {
    line: number;
    column: number;
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
    this.color = this.generateColor()
    this.presence = {
      cursor: {
        line: initialPresence?.cursor?.line ?? 0,
        column: initialPresence?.cursor?.column ?? 0,
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
  private users:User[]
  private pendingId:string | null = null;
  constructor(){
    this.rooms = new Map()
    this.users = []
  }
   /**
   * Adds a user to a users Array.
   * @param user
   */
  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user)
  }

  removeUser(userId: string) {
    for (const [roomId, users] of this.rooms.entries()) {
      const updatedUsers = users.filter(u => u.id !== userId);
      
      if (updatedUsers.length === 0) {
        this.rooms.delete(roomId);
      } else {
        this.rooms.set(roomId, updatedUsers);
      }
    }
  }

  getUsersInRoom(roomId: string): User[] {
    return this.rooms.get(roomId) || [];
  }

  updateUserPresence(userId: string, presence: Partial<UserPresence>) {
    // Update user presence in all rooms they're in
    for (const users of this.rooms.values()) {
      const user = users.find(u => u.id === userId);
      if (user) {
        user.updatePresence(presence);
      }
    }
  }

  broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
    const users = this.rooms.get(roomId) || [];
    console.log(users,excludeUserId)
    for (const user of users) {
      if (excludeUserId && user.id === excludeUserId) continue;
      user.socket.send(message);
    }
  }
  private addHandler(user: User) {
    user.socket.on("message", async (data) => {
        const message = JSON.parse(data.toString()) as ClientMessage;
        if (message.type === EventTypes.CREATE_ROOM) {
            const roomId = randomUUID(); 
            this.rooms.set(roomId,[user])
            user.socket.send(JSON.stringify({ type: EventTypes.ROOM_CREATED, roomId })); 
        } else if (message.type === EventTypes.JOIN_ROOM) {
            const { roomId }:{roomId:string} = message.payload; 
            if(this.rooms.has(roomId)){
              this.rooms.get(roomId)?.push(user)
              user.socket.send(JSON.stringify({ type: EventTypes.JOINED_ROOM, roomId })); 
              this.broadcastToRoom(roomId,JSON.stringify({type:EventTypes.USER_JOINED,message:`${user.email} has joined`}),user.id)
            } else {
              user.socket.send(JSON.stringify({type:EventTypes.ERROR,message: "Room does not exist." }))
            }
        } else if (message.type === EventTypes.CURSOR_MOVE) {
          const { roomId, cursor } = message.payload;
      
          this.updateUserPresence(user.id, { cursor });
      
          this.broadcastToRoom(
              roomId,
              JSON.stringify({
                  type: EventTypes.CURSOR_MOVE,
                  userId: user.id,
                  cursor,
                  color:user.color,
                  displayName:user.displayName
              }),
              user.id 
          );
        } else if (message.type === EventTypes.SEND_ENCRYPTED_DATA) {
          const { roomId, encryptedData } = message.payload;
            
          this.broadcastToRoom(
            roomId,
            JSON.stringify({
                type: EventTypes.RECEIVE_ENCRYPTED_DATA,
                userId: user.id,
                encryptedData,
            }),
            user.id 
        );
        }

    });
  }
}