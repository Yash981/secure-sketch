import { randomUUID} from 'crypto'
import { WebSocket } from 'ws';
export class User{
  public socket: WebSocket;
  public email: string;
  public id:string

  constructor(socket: WebSocket,email:string) {
    this.socket = socket;
    this.email = email;
    this.id = randomUUID();
  }
}
export class CollaborationManager{
  private users:Map<string,User[]> = new Map() //roomId --> User[]
  private userRooms: Map<string,string[]> = new Map() // userId --> roomIds
}