import React, { useContext, useState } from "react";
import styled from "styled-components";
import ConversationsContext from "../context/ConversationsContext";
import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";
import { Conversation } from "../types";
import ChatRoom from "./ChatRoom";
import UserIcon from "./UserIcon";

const ChatPage = styled.div`
  max-height: calc(100% - 10vh);
  overflow-y: scroll;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin: 1rem;
`;

const NewMatchesWrap = styled.div`
  max-width: 100%;
  overflow-x: scroll;
  padding: 0.5rem 1rem;
  display: flex;

  & > * {
    margin: 0 0.5rem;
    flex-shrink: 0;
  }
`;

const ConvosWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 100%;

  & > * {
    margin: 0.5rem 0;
  }
`;

const Convo = styled.div`
  display: grid;
  grid: 1fr / 100px 1fr;
  place-items: center;
`;

const ConvoText = styled.div``;

const Chat = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const conversations = useContext(ConversationsContext);

  const [openConvo, setOpenConvo] = useState<Conversation | null>(null);

  return (
    <ChatPage>
      {openConvo && (
        <ChatRoom convo={openConvo} close={() => setOpenConvo(null)} />
      )}
      {user && users.length >= 1 && conversations.length >= 1 && (
        <>
          <Title>New Matches</Title>
          <NewMatchesWrap>
            {conversations
              .filter((convo) => convo.latest.origin === "header")
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((convo) => {
                const match = users.find(
                  (cur) =>
                    cur.uid !== user.uid && convo.members.includes(cur.uid)
                );

                return (
                  <UserIcon
                    key={match?.uid}
                    width="80px"
                    height="80px"
                    src={match?.profile.photos[0].src || userPlaceholder}
                    className={convo.latest.seen ? "" : "not-seen"}
                    onClick={() => setOpenConvo(convo)}
                  />
                );
              })}
          </NewMatchesWrap>
          <Title>Messages</Title>
          <ConvosWrap>
            {conversations
              .filter((convo) => convo.latest.origin !== "header")
              .sort((a, b) => b.latest.timestamp - a.latest.timestamp)
              .map((convo) => (
                <Convo>
                  <UserIcon
                    width="100px"
                    height="100px"
                    src={
                      users.find(
                        (cur) =>
                          cur.uid !== user.uid &&
                          convo.members.includes(cur.uid)
                      )!.profile.photos[0].src
                    }
                    className={
                      convo.latest.origin === user.uid || convo.latest.seen
                        ? ""
                        : "not-seen"
                    }
                  />
                  <ConvoText>{convo.latest.text}</ConvoText>
                </Convo>
              ))}
          </ConvosWrap>
        </>
      )}
      {conversations.length < 1 && <div>No Matches to display yet.</div>}
    </ChatPage>
  );
};

export default Chat;
