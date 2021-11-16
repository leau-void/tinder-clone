import React, { useContext, useState } from "react";
import styled from "styled-components";
import ConversationsContext from "../context/ConversationsContext";
import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";
import { Conversation } from "../types";
import ChatRoom from "./ChatRoom";
import UserIcon from "./UserIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faReply } from "@fortawesome/free-solid-svg-icons";

const ChatPage = styled.div`
  height: calc(100% - 10vh);
  overflow-y: scroll;
  color: #424242;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  margin: 1rem;
  color: #3d84a8;
`;

const NewMatchesWrap = styled.div`
  max-width: 100%;
  overflow-x: scroll;
  padding: 0.5rem 1rem;
  padding-bottom: 0;
  display: flex;

  & > * {
    margin: 0 0.5rem;
    flex-shrink: 0;
  }
`;

const UserIconWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const UserName = styled.h3`
  margin: 0;
  font-weight: 600;
  margin: 0.25rem 0;
  color: black;
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
  cursor: pointer;
`;

const ConvoTextWrap = styled.div`
  width: 100%;
  overflow-x: hidden;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid lightgrey;
`;

const ConvoText = styled.div`
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chat = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const conversations = useContext(ConversationsContext);

  const [openConvo, setOpenConvo] = useState<Conversation | null>(null);

  const findUser = (members: [uid1: string, uid2: string]) =>
    users.find((cur) => cur.uid !== user?.uid && members.includes(cur.uid));

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
                const match = findUser(convo.members);

                return (
                  <UserIconWrap
                    key={convo.id}
                    onClick={() => setOpenConvo(convo)}>
                    <UserIcon
                      key={match?.uid}
                      width="80px"
                      height="80px"
                      src={match?.profile.photos[0].src || userPlaceholder}
                      className={convo.latest.seen ? "" : "not-seen"}
                    />
                    <UserName>{match?.profile.name || ""}</UserName>
                  </UserIconWrap>
                );
              })}
          </NewMatchesWrap>
          <Title>Messages</Title>
          <ConvosWrap>
            {conversations
              .filter((convo) => convo.latest.origin !== "header")
              .sort((a, b) => b.latest.timestamp - a.latest.timestamp)
              .map((convo) => {
                const match = findUser(convo.members);
                return (
                  <Convo key={convo.id} onClick={() => setOpenConvo(convo)}>
                    <UserIcon
                      width="70px"
                      height="70px"
                      src={match?.profile.photos[0].src || userPlaceholder}
                      className={
                        convo.latest.origin === user.uid || convo.latest.seen
                          ? ""
                          : "not-seen"
                      }
                    />

                    <ConvoTextWrap>
                      <UserName>{match?.profile.name || ""}</UserName>
                      <ConvoText>
                        {convo.latest.origin === user.uid && (
                          <FontAwesomeIcon
                            style={{ marginRight: "0.5rem" }}
                            size="sm"
                            color="inherit"
                            icon={faReply}
                          />
                        )}
                        {convo.latest.assetsPresent && (
                          <FontAwesomeIcon
                            style={{ marginRight: "0.5rem" }}
                            size="sm"
                            color="inherit"
                            icon={faImage}
                          />
                        )}
                        {convo.latest.text}
                      </ConvoText>
                    </ConvoTextWrap>
                  </Convo>
                );
              })}
          </ConvosWrap>
        </>
      )}
      {conversations.length < 1 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem 0 1rem",
            fontSize: "1.1rem",
          }}>
          No Matches to display yet. <br />
          <br />
          You should probably go back to the feed!
        </div>
      )}
    </ChatPage>
  );
};

export default Chat;
