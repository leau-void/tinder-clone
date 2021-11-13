import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { Conversation, Message } from "../types";
import UserIcon from "./UserIcon";
import { getDocs, collection } from "@firebase/firestore";
import UsersContext from "../context/UsersContext";
import UserContext from "../context/UserContext";

interface ChatRoomProps {
  convo: Conversation;
}

const ChatRoom = ({ convo }: ChatRoomProps) => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);

  useEffect(() => {}, [convo]);

  const match = useRef(
    users.find(
      (cur) => cur.uid !== user?.uid && convo.members.includes(cur.uid)
    )
  );

  return <div></div>;
};

export default ChatRoom;
