export interface Message {
  origin: string;
  text: string;
  timestamp: number;
  seen?: boolean;
}

export default interface Conversation {
  timestamp: number;
  messages: Message[];
  members: [string, string];
  latest?: Message;
}
