import { Timestamp } from "@firebase/firestore";

export interface Message {}

export default interface Chat {
  match: Timestamp;
  messages: Message[];
  members: [string, string];
}
