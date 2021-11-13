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
import { onSnapshot, collection, doc, updateDoc } from "@firebase/firestore";
import UsersContext from "../context/UsersContext";
import UserContext from "../context/UserContext";
import { db } from "../App";
import ModalMenu from "./ModalMenu";
import { TopButtonBack } from "./ModalMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faBackspace } from "@fortawesome/free-solid-svg-icons";
import { getImageUrl } from "../utils/getImageURL";
import imgPlaceholder from "../assets/placeholders/imgPlaceholder.png";

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
  overflow-y: scroll;

  &.preview-open {
    height: calc(100% - 8vh - 15vh);
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
  height: 100%;
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

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
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
        <MessagesArea className={imgVal ? "preview-open" : ""}></MessagesArea>
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
