import React, { useContext } from "react";
import styled from "styled-components";
import ConversationsContext from "../context/ConversationsContext";
import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";

const ChatRoom = styled.div``;

const NewMatchesWrap = styled.div``;
const NewMatch = styled.div``;

const ConvosWrap = styled.div``;
const Convo = styled.div``;

const Chat = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const conversations = useContext(ConversationsContext);

  return (
    <ChatRoom>
      <NewMatchesWrap>
        {conversations
          .filter((convo) => !convo.latest)
          .map((convo) => (
            <NewMatch>{convo.members.toString()}</NewMatch>
          ))}
      </NewMatchesWrap>
      <ConvosWrap>
        {conversations
          .filter((convo) => convo.latest)
          .map((convo) => (
            <Convo>{convo.latest!.text}</Convo>
          ))}
      </ConvosWrap>
    </ChatRoom>
  );
};

export default Chat;
