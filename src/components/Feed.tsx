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
} from "firebase/firestore";
import { db } from "../App";
import { isPointWithinRadius } from "geolib";
import logo from "../assets/icons/waves-blue.png";
import { animationFeedBg } from "../utils/animations";

const StyledFeed = styled.main`
  height: calc(100% - 10vh);
  padding: 4rem 0.5rem;
  display: flex;
  margin: 0 auto;
  position: relative;
`;

const CardWrap = styled.div`
  position: relative;
  height: 400px;
  width: 300px;

  & > * {
    top: 0;
  }
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: center / contain no-repeat url(${logo}), #f4f4f4;
  background-size: 20vw;
  position: absolute;
  z-index: ${({ close }: { close: boolean }) => (close ? -1 : 150)};
  transition: all 2s linear;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  opacity: ${({ close }: { close: boolean }) => (close ? 0 : 1)};

  ::before {
    content: "";
    display: block;
    width: 25vw;
    height: 25vw;
    border: 2px solid #46cdcf;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: ${animationFeedBg};
  }

  ::after {
    content: "";
    display: block;
    width: 75vw;
    height: 75vw;
    border: 2px solid #46cdcf;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: ${animationFeedBg};
    animation-direction: reverse;
  }
`;

const CardDiv = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 8px;
  transition: tranform 0.01s linear;

  &.like {
    ::after {
      content: "Like";
      display: block;
      color: #4ecd97;
      font-size: 2rem;
      line-height: 2rem;
      font-weight: 700;
      top: 3rem;
      border: 5px dashed;
      border-radius: 20px;
      padding: 0.5rem;
      right: 1.5rem;
      position: absolute;
      transform: rotate(10deg);
    }
  }
  &.dislike {
    ::after {
      content: "Pass";
      display: block;
      color: #fb745d;
      font-size: 2rem;
      line-height: 2rem;
      font-weight: 700;
      top: 3rem;
      border: 5px dashed;
      border-radius: 20px;
      padding: 0.5rem;
      left: 1.5rem;
      position: absolute;
      transform: rotate(-10deg);
    }
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

const EnableGlobalButton = styled.button`
  border: 0;
  background: #3d84a8;
  padding: 0.5rem;
  margin-top: 0.5rem;
  color: #fafafa;
  border-radius: 20px;

  &:hover {
    background: #46cdcf;
    transform: scale(1.1);
  }
`;

const Feed = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const [avail, setAvail] = useState<User[]>([]);
  const [showBg, setShowBg] = useState(true);

  const likeHandler = async (uid: string) => {
    if (!user || !uid) return;

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
    if (!user || !uid) return;
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
    window.setTimeout(() => setShowBg(false), 2000);
  }, [user, users]);

  const enableGlobal = () => {
    if (!user) return;
    updateDoc(doc(db, "users", user.uid), {
      "settings.global": true,
    });
  };

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const latestX = useRef<number | null>(null);
  const latestY = useRef<number | null>(null);
  const card = useRef<HTMLElement | null>(null);

  const [status, setStatus] = useState<null | "like" | "dislike">(null);
  const statusRef = useRef<null | "like" | "dislike">(null);
  const [blockClicks, setBlockClick] = useState(false);

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!card.current) return;

    setBlockClick(true);

    latestX.current = 0;
    latestY.current = 0;

    if (e instanceof MouseEvent) {
      latestX.current = e.screenX;
      latestY.current = e.screenY;
    } else if (e instanceof TouchEvent) {
      e.preventDefault();
      latestX.current = e.targetTouches[0].screenX;
      latestY.current = e.targetTouches[0].screenY;
    }

    if (!startX.current || !startY.current) {
      startX.current = latestX.current;
      startY.current = latestY.current;
      return;
    }

    card.current.style.transform =
      "translate(" +
      (latestX.current - startX.current) +
      "px," +
      (latestY.current - startY.current) +
      "px) rotate(" +
      (latestX.current - startX.current) / 20 +
      "deg)";

    const { left, right } = card.current.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const newDiff = latestX.current - startX.current;
    if (newDiff < 50 && newDiff > -50) {
      setStatus(null);
      statusRef.current = null;
    } else if (right > bodyWidth * 0.85) {
      setStatus("like");
      statusRef.current = "like";
    } else if (left < bodyWidth * 0.15) {
      setStatus("dislike");
      statusRef.current = "dislike";
    } else {
      setStatus(null);
      statusRef.current = null;
    }
  };

  const moveEnd = (e: MouseEvent | TouchEvent) => {
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", moveEnd);

    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", moveEnd);

    let curCard: HTMLElement;
    if (card.current) {
      curCard = card.current;
      curCard.style.transition = "all 0.3s linear";
    }

    if (card.current && !statusRef.current) {
      curCard!.style.transform = "";
      window.setTimeout(() => {
        curCard.style.transition = "";
      }, 300);
    } else if (
      card.current &&
      startX.current &&
      startY.current &&
      latestX.current &&
      latestY.current
    ) {
      switch (statusRef.current) {
        case "like":
          card.current.style.transform =
            "translate(100vw," +
            (latestY.current - startY.current) +
            "px) rotate(25deg)";
          window.setTimeout(() => {
            likeHandler(curCard!.dataset.uid || "");
          }, 300);
          break;
        case "dislike":
          card.current.style.transform =
            "translate(-100vw," +
            (latestY.current - startY.current) +
            "px) rotate(" +
            (latestX.current - startX.current) / 20 +
            "deg)";
          window.setTimeout(() => {
            dislikeHandler(curCard!.dataset.uid || "");
          }, 300);
      }
    }

    startX.current = null;
    startY.current = null;
    latestX.current = null;
    latestY.current = null;
    setStatus(null);
    statusRef.current = null;
    card.current = null;
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
      {showBg && <Background close={!!avail.length} />}

      <CardWrap>
        {!avail.length && user && !user.settings.global && (
          <CardDiv
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "1.1rem",
              background: "#f4f4f4",
              height: "100%",
              width: "100%",
            }}>
            No one found in your search perimeter.
            <div
              style={{
                width: "100%",
                marginTop: "1rem",
              }}>
              <div>
                You should probably
                <EnableGlobalButton onClick={() => enableGlobal()}>
                  Enable Global Search
                </EnableGlobalButton>
              </div>
            </div>
          </CardDiv>
        )}
        {avail.slice(0, 1).map((cur, i, arr) => (
          <CardDiv
            onMouseDown={dragHandler}
            onTouchStart={dragHandler}
            key={cur.uid}
            data-uid={cur.uid}
            className={
              i === arr.length - 1
                ? status === "like"
                  ? "card-wrap like"
                  : status === "dislike"
                  ? "card-wrap dislike"
                  : "card-wrap"
                : "card-wrap"
            }>
            <ProfileCard user={cur} blockClicks={blockClicks}>
              <ButtonsWrap
                onClickCapture={() => {
                  setBlockClick(true);
                  window.setTimeout(() => setBlockClick(false), 100);
                }}>
                <Button color="#FB745D" onClick={() => dislikeHandler(cur.uid)}>
                  <Icon color="#FB745D" size="lg" icon={faTimes} />
                </Button>
                <Button color="#4ECD97" onClick={() => likeHandler(cur.uid)}>
                  <Icon color="#4ECD97" size="lg" icon={faHeart} />
                </Button>
              </ButtonsWrap>
            </ProfileCard>
          </CardDiv>
        ))}
      </CardWrap>
    </StyledFeed>
  );
};

export default Feed;
