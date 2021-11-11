import React from "react";
import { User } from "../types";

const UsersContext = React.createContext<User[]>([]);

export const UsersProvider = UsersContext.Provider;

export default UsersContext;
