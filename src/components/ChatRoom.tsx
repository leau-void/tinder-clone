import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Conversation, Message } from "../types";
import UserIcon from "./UserIcon";
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  query,
  where,
} from "@firebase/firestore";
import UsersContext from "../context/UsersContext";
import UserContext from "../context/UserContext";
import { db } from "../App";
import ModalMenu from "./ModalMenu";
import { TopButtonBack } from "./ModalMenu";

const StyledChatRoom = styled.div``;

interface ChatRoomProps {
  convo: Conversation;
  close: () => void;
}

const ChatRoom = ({ convo, close }: ChatRoomProps) => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const convoRef = useRef(doc(db, "conversations", convo.id));
  const messagesRef = useRef(
    collection(db, "conversations", convo.id, "messages")
  );

  useEffect(() => {
    if (!user) return;
    if (convo.latest.origin !== user.uid && !convo.latest.seen) {
      updateDoc(convoRef.current, {
        "latest.seen": true,
      });
    }

    let unsubMessages = onSnapshot(messagesRef.current, (snap) => {
      const msgDocs = snap.docs
        .map((msgDoc) => msgDoc.data() as Message)
        .sort((a, b) => a.timestamp - b.timestamp);

      setMessages(msgDocs);

      const latestMsg = msgDocs[msgDocs.length - 1];
      if (latestMsg.id !== convo.latest.id)
        updateDoc(convoRef.current, {
          latest: latestMsg,
        });
    });

    return () => unsubMessages();
  }, [convo, user]);

  const match = useRef(
    users.find(
      (cur) => cur.uid !== user?.uid && convo.members.includes(cur.uid)
    )
  );

  console.log(messages);

  return (
    <ModalMenu
      title="convo"
      buttons={{ left: <TopButtonBack onClick={close} /> }}
      doOpen={Boolean(convo)}
      animation="horizontal">
      <StyledChatRoom>CHATROOM</StyledChatRoom>
    </ModalMenu>
  );
};

export default ChatRoom;
