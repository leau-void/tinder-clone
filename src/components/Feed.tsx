import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";
import { User } from "../types";
import ProfileCard from "./ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { updateDoc, doc, arrayUnion } from "@firebase/firestore";
import { db } from "../App";

const StyledFeed = styled.main`
  height: 100%;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CardWrap = styled.div`
  position: relative;
  height: 400px;
  width: 300px;

  & > * {
    top: 0;
  }
`;

const Icon = styled(FontAwesomeIcon)``;

const ButtonsWrap = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-evenly;
  position: relative;
  padding: 0.25em;

  .full-size & {
    width: calc(100% - 15px);
    bottom: 0;
    position: fixed;
    padding: 1rem;
    background: linear-gradient(0deg, white 40%, transparent);
  }
`;

const Button = styled.button`
  background: 0;
  border: 2px solid ${(props: { color?: string }) => props.color || "black"};
  border-radius: 50%;
  width: 2.6em;
  height: 2.6em;
`;

const Feed = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const [avail, setAvail] = useState<User[]>([]);

  const likeHandler = (uid: string) => {
    if (!user) return;
    updateDoc(doc(db, "users", user.uid), {
      likes: arrayUnion(uid),
    });
  };

  const dislikeHandler = (uid: string) => {
    if (!user) return;
    updateDoc(doc(db, "users", user.uid), {
      dislikes: arrayUnion(uid),
    });
  };

  useEffect(() => {
    if (!user || !users) return;

    setAvail(
      users.filter(
        (cur) =>
          cur.uid !== user.uid &&
          !user.likes.includes(cur.uid) &&
          !user.dislikes.includes(cur.uid)
      )
    );
  }, [user, users]);

  console.log(avail);

  return (
    <StyledFeed>
      <CardWrap>
        {avail
          .slice(0, 5)
          .reverse()
          .map((cur) => (
            <ProfileCard key={cur.uid} user={cur}>
              <ButtonsWrap>
                <Button color="#FB745D" onClick={() => dislikeHandler(cur.uid)}>
                  <Icon color="#FB745D" size="lg" icon={faTimes} />
                </Button>
                <Button color="#4ECD97" onClick={() => likeHandler(cur.uid)}>
                  <Icon color="#4ECD97" size="lg" icon={faHeart} />
                </Button>
              </ButtonsWrap>
            </ProfileCard>
          ))}
      </CardWrap>
    </StyledFeed>
  );
};

export default Feed;
