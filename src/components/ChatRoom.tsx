import React, {
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Conversation, Message, User } from "../types";
import UserIcon from "./UserIcon";
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  setDoc,
  Timestamp,
} from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uniqid from "uniqid";
import UsersContext from "../context/UsersContext";
import UserContext from "../context/UserContext";
import { db, store } from "../App";
import ModalMenu, { Section } from "./ModalMenu";
import { TopButtonBack } from "./ModalMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faBackspace } from "@fortawesome/free-solid-svg-icons";
import { getImageUrl } from "../utils/getImageURL";
import imgPlaceholder from "../assets/placeholders/imgPlaceholder.png";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";
import formatDate from "../utils/formatDate";
import ProfileCard from "./ProfileCard";

const StyledIconWrap = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledChatRoom = styled.div`
  height: inherit;
  width: 100%;
`;

const MessagesArea = styled.div`
  height: calc(100% - 8vh);
  width: 100%;
  padding: 1rem;
  padding-right: 0.5rem;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;

  &.preview-open {
    height: calc(100% - 8vh - 15vh);
  }

  & > * {
    margin: 0.5rem 0;
  }
`;

const MessageWrap = styled.div`
  display: flex;
  max-width: 70%;
  align-items: center;

  & > * {
    margin-right: 0.5rem;
  }

  &.header {
    align-self: center;
  }

  &.sent {
    align-self: end;
    align-self: flex-end;
  }

  &.received {
    align-self: start;
    align-self: flex-start;
  }
`;

const MessageDiv = styled.div`
  width: 100%;
  background: #fafafa;
  border-radius: 20px;
  padding: 1rem;

  & > * {
    margin-top: 0.5rem;
  }

  .header > & {
    background: 0;
    text-align: center;
    padding-top: 0.25rem;
  }

  .sent > & {
    color: white;
    background: blue;
  }
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  height: 8vh;
  align-items: center;
  padding: 0.25rem 0.5rem;
  position: relative;
`;

const InputText = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  padding-right: 4rem;
  border-radius: 20px;
  border: 0;
`;

const InputImg = styled.input`
  opacity: 0;
  position: fixed;
  left: -100vw;
`;

const LabelInputImg = styled.label`
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

const SendButton = styled.button`
  background: transparent;
  border: 0;
  position: absolute;
  right: 1rem;
  height: 100%;

  &:not(:disabled) {
    color: #3d84a8;
  }
`;

const ImagePreview = styled.div`
  height: 15vh;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
`;

const Image = styled.img`
  max-height: 100%;
  max-width: 100%;
  border-radius: 8px;
  cursor: pointer;

  .fs-modal > & {
    cursor: unset;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const DeleteImage = styled.button`
  margin: 0 0.5rem;
  border: 0;
  background: 0;
  color: inherit;

  &:hover {
    color: black;
  }
`;

const FSModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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

const Background = styled.div`
  height: 100%;
  width: 100%;
  background: #424242;
  top: 0;
  left: 0;
  position: absolute;
  z-index: -1;
`;

const PhotoFullScreen = ({
  src,
  close,
}: {
  src: string;
  close: () => void;
}) => {
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") close();
    };
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [close]);

  const [placeholderShown, setPlaceholderShown] = useState(true);

  return (
    <FSModal className="fs-modal">
      <Background onClick={() => close()} />
      <Image
        onLoad={() => setPlaceholderShown(false)}
        src={src || imgPlaceholder}
        width="80%"
      />
      {placeholderShown && <Image src={imgPlaceholder} width="80%" />}

      <CloseButton onClick={() => close()}>
        <X />
      </CloseButton>
    </FSModal>
  );
};

const UserIconWrap = ({
  user,
  onClick,
}: {
  user: User;
  onClick: () => void;
}) => (
  <StyledIconWrap onClick={onClick}>
    <UserIcon width="6vh" height="6vh" src={user.profile.photos[0].src} />
    <small style={{ paddingLeft: "0.5rem" }}>{user.profile.name}</small>
  </StyledIconWrap>
);

interface ChatRoomProps {
  convo: Conversation;
  close: () => void;
}

const ChatRoom = ({ convo, close }: ChatRoomProps) => {
  const [isOpen, setIsOpen] = useState(Boolean(convo));
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const convoRef = useRef(doc(db, "conversations", convo.id));
  const messagesRef = useRef(
    collection(db, "conversations", convo.id, "messages")
  );

  const [textVal, setTextVal] = useState("");
  const [imgVal, setImgVal] = useState<File | null>(null);
  const [imgURL, setImgURL] = useState("");
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [fullScreen, setFullScreen] = useState<string>("");

  const [openProfile, setOpenProfile] = useState(false);
  const [doOpenProfile, setDoOpenProfile] = useState(false);

  const match = useRef(
    users.find(
      (cur) => cur.uid !== user?.uid && convo.members.includes(cur.uid)
    )
  );

  const submitHandler = async (e: SyntheticEvent) => {
    if (!user) return;
    e.preventDefault();

    const text = textVal;
    const img = imgVal
      ? new File([imgVal], imgVal.name, { type: imgVal.type })
      : null;

    setTextVal("");
    setImgURL("");
    setImgVal(null);

    const msgID = uniqid();

    const newMessage: Message = {
      origin: user.uid,
      text: text,
      timestamp: Timestamp.now().toMillis(),
      id: msgID,
      seen: false,
      assetsPresent: Boolean(img),
    };

    setDoc(doc(messagesRef.current, msgID), newMessage);
    updateDoc(convoRef.current, {
      latest: newMessage,
    });

    if (img) {
      const userPath = `users/${user.uid}`;
      const userRef = ref(store, userPath);

      const photoRef = ref(userRef, uniqid() + "." + img.type.split("/")[1]);
      const snap = await uploadBytes(photoRef, img);
      const src = await getDownloadURL(photoRef);

      updateDoc(doc(messagesRef.current, msgID), {
        assets: {
          path: snap.metadata.fullPath,
          src,
        },
      });
    }
  };
  // TODO add auto scroll to bottom
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

  useEffect(() => {
    if (!imgVal) {
      setImgURL("");
    } else {
      getImageUrl(imgVal, undefined).then((url) => setImgURL(url));
    }
  }, [imgVal]);

  if (!match.current) return null;

  return (
    <ModalMenu
      title={
        <UserIconWrap
          onClick={() => {
            setDoOpenProfile(true);
            setOpenProfile(true);
          }}
          user={match.current}
        />
      }
      buttons={{
        left: (
          <TopButtonBack
            onClick={() => {
              setIsOpen(false);
              window.setTimeout(() => close(), 300);
            }}
          />
        ),
      }}
      doOpen={isOpen}
      animation="horizontal">
      <StyledChatRoom>
        <MessagesArea className={imgVal ? "preview-open" : ""}>
          {messages.map((message) => (
            <>
              <small
                key={message.id + "date"}
                style={{ marginBottom: "-0.25rem", textAlign: "center" }}>
                {formatDate(message.timestamp)}
              </small>
              <MessageWrap
                key={message.id}
                className={
                  message.origin === "header"
                    ? "header"
                    : message.origin === user?.uid
                    ? "sent"
                    : "received"
                }>
                {message.origin !== "header" &&
                  message.origin !== user?.uid && (
                    <UserIcon
                      width="5vw"
                      height="5vw"
                      src={
                        match.current?.profile.photos[0].src || userPlaceholder
                      }
                    />
                  )}
                <MessageDiv>
                  {message.text}
                  {message.assetsPresent && (
                    <>
                      {message.assets && (
                        <Image
                          onClick={() =>
                            setFullScreen(message.assets?.src || imgPlaceholder)
                          }
                          onLoad={(e: SyntheticEvent) =>
                            e.currentTarget.nextElementSibling?.setAttribute(
                              "hidden",
                              "true"
                            )
                          }
                          src={message.assets.src}
                        />
                      )}
                      <Image src={imgPlaceholder} />
                    </>
                  )}
                </MessageDiv>
              </MessageWrap>
            </>
          ))}
        </MessagesArea>
        {imgVal && (
          <ImagePreview>
            <Image
              onClick={() => setFullScreen(imgURL)}
              src={imgURL ? imgURL : imgPlaceholder}
            />
            <DeleteImage
              onClick={() => {
                setImgVal(null);
                if (imgInputRef.current) imgInputRef.current.value = "";
              }}>
              <FontAwesomeIcon size="lg" icon={faBackspace} />
            </DeleteImage>
          </ImagePreview>
        )}
        <Form onSubmit={submitHandler}>
          <InputImg
            onChange={(e) =>
              setImgVal(e.currentTarget.files ? e.currentTarget.files[0] : null)
            }
            id="image-input"
            type="file"
            accept="image/*"
            ref={imgInputRef}
          />
          <LabelInputImg htmlFor="image-input">
            <FontAwesomeIcon size="lg" icon={faImage} />
          </LabelInputImg>
          <InputText
            type="text"
            value={textVal}
            onInput={(e) => setTextVal(e.currentTarget.value)}
          />
          <SendButton type="submit" disabled={!textVal && !imgVal}>
            Send
          </SendButton>
        </Form>
        {openProfile && (
          <ModalMenu
            doOpen={doOpenProfile}
            title={match.current.profile.name}
            animation="horizontal"
            buttons={{
              left: (
                <TopButtonBack
                  onClick={() => {
                    setDoOpenProfile(false);
                    window.setTimeout(() => setOpenProfile(false), 300);
                  }}
                />
              ),
            }}>
            <Section>
              <ProfileCard
                user={match.current}
                compareLocation={user?.location}
              />
            </Section>
          </ModalMenu>
        )}

        {fullScreen && (
          <PhotoFullScreen src={fullScreen} close={() => setFullScreen("")} />
        )}
      </StyledChatRoom>
    </ModalMenu>
  );
};

export default ChatRoom;
