import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { addDoc, Timestamp, collection } from "@firebase/firestore";
import UserContext from "../context/UserContext";
import { User } from "../types";
import { db } from "../App";
import ProfileCard from "./ProfileCard";

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
  color: white;
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
  background: white;
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
    const matchHandler = async (e: CustomEventInit) => {
      console.log(e);
      console.log(user);
      if (!user) return;
      const { match, timestamp }: { match: User; timestamp: number } = e.detail;

      setMatch(match);

      const docRef = await addDoc(collection(db, "conversations"), {
        timestamp,
        members: [user.uid, match.uid],
      });
      console.log(docRef);
      addDoc(collection(db, "chat", docRef.id, "messages"), {
        origin: "header",
        text: "You have matched with each other! You can now start talking.",
        timestamp: Timestamp.now().toMillis(),
      });
    };

    window.addEventListener("newMatch", matchHandler);

    return () => window.removeEventListener("newMatch", matchHandler);
  }, []);

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
