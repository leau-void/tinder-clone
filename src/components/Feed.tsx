import React, {
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import UserContext from "../context/UserContext";
import UsersContext from "../context/UsersContext";
import { User } from "../types";
import ProfileCard from "./ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  getDoc,
} from "@firebase/firestore";
import { db } from "../App";
import { isPointWithinRadius } from "geolib";

const StyledFeed = styled.main`
  height: calc(100% - 10vh);
  padding: 4rem 0.5rem;
  display: flex;
  margin: 0 auto;
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
    background: linear-gradient(0deg, #f5f5f5 40%, transparent);
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

  const likeHandler = async (uid: string) => {
    if (!user) return;

    const match = users.find((others) => others.uid === uid) as User;

    updateDoc(doc(db, "users", user.uid), {
      likes: arrayUnion(uid),
    });

    const sendMatchEvent = () =>
      window.dispatchEvent(
        new CustomEvent("newMatch", {
          detail: {
            match,
            timestamp: Timestamp.now().toMillis(),
          },
        })
      );

    if (!match.isHuman || match.likes.includes(user.uid)) {
      sendMatchEvent();
    } else {
      const matchDoc = await getDoc(doc(db, "users", match.uid));
      if ((matchDoc.data() as User).likes.includes(user.uid)) {
        sendMatchEvent();
      }
    }
  };

  const dislikeHandler = (uid: string) => {
    if (!user) return;
    updateDoc(doc(db, "users", user.uid), {
      dislikes: arrayUnion(uid),
    });
  };

  useEffect(() => {
    if (!user || !users) return;

    const locationFiltered = user.settings.global
      ? users
      : users.filter((cur) =>
          isPointWithinRadius(
            {
              latitude: user.location.lat,
              longitude: user.location.lon,
            },
            {
              latitude: cur.location.lat,
              longitude: cur.location.lon,
            },
            user.settings.distance * 1000
          )
        );

    setAvail(
      locationFiltered.filter(
        (cur) =>
          cur.uid !== user.uid &&
          !user.likes.includes(cur.uid) &&
          !user.dislikes.includes(cur.uid)
      )
    );
  }, [user, users]);

  // TODO add handling for swiping cards

  // TODO add logo in bg and button to turn global on if global is off

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const card = useRef<HTMLElement | null>(null);

  const [status, setStatus] = useState<null | "like" | "dislike">(null);
  const [blockClicks, setBlockClick] = useState(false);

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!card.current) return;

    setBlockClick(true);

    let newX = 0;
    let newY = 0;

    if (e instanceof MouseEvent) {
      newX = e.screenX;
      newY = e.screenY;
    } else if (e instanceof TouchEvent) {
      e.preventDefault();
      newX = e.targetTouches[0].screenX;
      newY = e.targetTouches[0].screenY;
    }

    if (!startX.current || !startY.current) {
      startX.current = newX;
      startY.current = newY;
      return;
    }

    card.current.style.transform =
      "translate(" +
      (newX - startX.current) +
      "px," +
      (newY - startY.current) +
      "px)";
  };

  const moveEnd = (e: MouseEvent | TouchEvent) => {
    startX.current = null;
    startY.current = null;

    if (card.current) {
      card.current.style.transform = "";
    }

    card.current = null;

    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", moveEnd);

    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", moveEnd);
  };

  const dragHandler = (e: SyntheticEvent) => {
    if ((e.target as HTMLElement).closest(".full-size")) return;
    setBlockClick(false);
    e.preventDefault();

    const findCard = (e.target as HTMLElement).closest(".card-wrap");
    if (findCard) {
      card.current = findCard as HTMLElement;

      document.addEventListener("mousemove", moveHandler, { passive: false });
      document.addEventListener("mouseup", moveEnd);

      document.addEventListener("touchmove", moveHandler, { passive: false });
      document.addEventListener("touchend", moveEnd);
    }
  };

  return (
    <StyledFeed>
      <CardWrap>
        {avail
          .slice(0, 5)
          .reverse()
          .map((cur) => (
            <div
              className="card-wrap"
              onMouseDown={dragHandler}
              onTouchStart={dragHandler}
              key={cur.uid}>
              <ProfileCard user={cur} blockClicks={blockClicks}>
                <ButtonsWrap>
                  <Button
                    color="#FB745D"
                    onClick={() => dislikeHandler(cur.uid)}>
                    <Icon color="#FB745D" size="lg" icon={faTimes} />
                  </Button>
                  <Button color="#4ECD97" onClick={() => likeHandler(cur.uid)}>
                    <Icon color="#4ECD97" size="lg" icon={faHeart} />
                  </Button>
                </ButtonsWrap>
              </ProfileCard>
            </div>
          ))}
      </CardWrap>
    </StyledFeed>
  );
};

export default Feed;
