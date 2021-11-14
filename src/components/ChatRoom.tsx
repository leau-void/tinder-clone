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
import ModalMenu from "./ModalMenu";
import { TopButtonBack } from "./ModalMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faBackspace } from "@fortawesome/free-solid-svg-icons";
import { getImageUrl } from "../utils/getImageURL";
import imgPlaceholder from "../assets/placeholders/imgPlaceholder.png";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";
import formatDate from "../utils/formatDate";

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
          onClick={() => console.log("click")}
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
              <small style={{ marginBottom: "-0.25rem", textAlign: "center" }}>
                {formatDate(message.timestamp)}
              </small>
              <MessageWrap
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
                    <Image src={message.assets?.src || imgPlaceholder} />
                  )}
                </MessageDiv>
              </MessageWrap>
            </>
          ))}
        </MessagesArea>
        {imgVal && (
          <ImagePreview>
            <Image src={imgURL ? imgURL : imgPlaceholder} />
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
      </StyledChatRoom>
    </ModalMenu>
  );
};

export default ChatRoom;