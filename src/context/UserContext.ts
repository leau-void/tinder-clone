import React from "react";
import { User } from "../types";

const UserContext = React.createContext<User | null>(null);

export const UserProvider = UserContext.Provider;

export default UserContext;
