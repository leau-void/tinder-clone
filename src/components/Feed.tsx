import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";
import { User } from "../types";
import ProfileCard from "./ProfileCard";

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
    position: absolute;
    top: 0;
  }
`;

const Feed = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const [avail, setAvail] = useState<User[]>([]);

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
            <ProfileCard key={cur.uid} user={cur} />
          ))}
      </CardWrap>
    </StyledFeed>
  );
};

export default Feed;
