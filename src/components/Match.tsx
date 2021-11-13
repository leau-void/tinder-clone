import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { setDoc, doc, Timestamp } from "@firebase/firestore";
import UserContext from "../context/UserContext";
import { User } from "../types";
import { db } from "../App";
import ProfileCard from "./ProfileCard";
import uniqid from "uniqid";

const MatchListener = styled.div``;

const MatchModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  background: lightblue;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: #3d84a8;
  box-shadow: inset 0 0 15vh 15vh #424242;
  z-index: 100;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #f5f5f5;
  text-align: center;
  order: -1;
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  width: 3rem;
  height: 3rem;
  top: 1rem;
  right: 1rem;
  position: absolute;
  border: 0;
  background: 0;
`;

const X = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  background: #f5f5f5;
  margin: 0 auto;
  clip-path: polygon(
    0% 5%,
    45% 50%,
    0% 95%,
    5% 100%,
    50% 55%,
    95% 100%,
    100% 95%,
    55% 50%,
    100% 5%,
    95% 0%,
    50% 45%,
    5% 0%
  );
`;

const Match = () => {
  const [match, setMatch] = useState<User | null>(null);
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    const matchHandler = async (e: CustomEventInit) => {
      if (!user) return;
      const { match, timestamp }: { match: User; timestamp: number } = e.detail;

      setMatch(match);

      const messageID = uniqid();

      const headerMsg = {
        origin: "header",
        text: "You have matched with each other! You can now start talking.",
        timestamp: Timestamp.now().toMillis(),
        id: messageID,
        seen: false,
      };

      const convoID = uniqid();

      setDoc(doc(db, "conversations", convoID), {
        timestamp,
        members: [user.uid, match.uid],
        id: convoID,
        latest: headerMsg,
      });

      setDoc(
        doc(db, "conversations", convoID, "messages", messageID),
        headerMsg
      );
    };

    window.addEventListener("newMatch", matchHandler);

    return () => window.removeEventListener("newMatch", matchHandler);
  }, [user]);

  return (
    <MatchListener>
      {match && (
        <MatchModal>
          <ProfileCard user={match} onlyPhotos>
            <CloseButton onClick={() => setMatch(null)}>
              <X />
            </CloseButton>
            <Title>New match with {match.profile.name}</Title>
          </ProfileCard>
        </MatchModal>
      )}
    </MatchListener>
  );
};

export default Match;
