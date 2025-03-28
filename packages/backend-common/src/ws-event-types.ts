export enum EventTypes {
    USER_JOINED = "USER_JOINED",
    USER_LEFT = "USER_LEFT",
    PRESENCE_UPDATE = "PRESENCE_UPDATE",
    DRAWING_ACTION = "DRAWING_ACTION",
    CLEAR_CANVAS = "CLEAR_CANVAS",
    INIT_COLLABORATION = "INIT_COLLABORATION",
    JOIN_COLLABORATION='JOIN_COLLABORATION',
    CREATE_ROOM = "CREATE_ROOM",
    JOIN_ROOM = "JOIN_ROOM",
    LEAVE_ROOM = "LEAVE_ROOM",
    ROOM_UPDATED = "ROOM_UPDATED",
    SYNC_DRAWING = "SYNC_DRAWING",
    USER_DISCONNECTED = "USER_DISCONNECTED",
    USER_RECONNECTED = "USER_RECONNECTED",
    ROOM_CREATED = "ROOM_CREATED",
    JOINED_ROOM = "JOINED_ROOM",
    ERROR='ERROR',
    CURSOR_MOVE='CURSOR_MOVE',
    SEND_ENCRYPTED_DATA='SEND_ENCRYPTED_DATA',
    RECEIVE_ENCRYPTED_DATA='RECEIVE_ENCRYPTED_DATA',
    CURSOR_MOVED='CURSOR_MOVED'
  }
  export interface ClientMessage {
      type:EventTypes,
      payload:any
  }