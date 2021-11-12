import React from "react";
import { Conversation } from "../types";

const ConversationsContext = React.createContext<Conversation[]>([]);

export const ConversationsProvider = ConversationsContext.Provider;

export default ConversationsContext;
