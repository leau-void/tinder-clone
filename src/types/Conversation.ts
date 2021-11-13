import { Photo } from ".";

export interface Message {
  origin: string;
  text: string;
  timestamp: number;
  id: string;
  seen: boolean;
  assets?: Photo;
  assetsPresent?: boolean;
}

export default interface Conversation {
  timestamp: number;
  messages: Message[];
  members: [string, string];
  latest: Message;
  id: string;
}
