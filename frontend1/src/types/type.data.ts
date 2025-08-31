export interface user {
    _id:string;
    name:string;
    avatar:string;
    email:string;
    username:string;
    online:boolean;
    gender:string
}

export  interface message{
    id:string;
    senderId:string;
    receiverId:string;
    message:string;
    timestamp:string;
    read:boolean;
}
export interface lastMessage{
senderId:String;
senderName:String;
senderProfile:String;
text:String
}
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  username: string;
  online: boolean;
  gender: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface LastMessage {
  senderId: string;
  senderName: string;
  senderProfile: string;
  text: string;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: LastMessage;
  unreadCount: number;
}

export  interface chat{
    id:string;
    participants:string[];
    lastMessage?:message;
    unreadCount:number;
}