import {
  doc,
  updateDoc,
  Timestamp,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router";
import NavBar from "./NavBar";
import styled from "styled-components";
import { Conversation } from "../types";
import { db } from "../App";
import UserContext from "../context/UserContext";
import Feed from "./Feed";
import Profile from "./Profile";
import Chat from "./Chat";
import { User } from "../types";
import { UsersProvider } from "../context/UsersContext";
import { ConversationsProvider } from "../context/ConversationsContext";

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
`;

const Main = () => {
  const user = useContext(UserContext);

  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;

    let unsubUsers = onSnapshot(collection(db, "users"), (snap) =>
      setUsers(snap.docs.map((userDoc) => userDoc.data() as User))
    );

    let unsubConvo = onSnapshot(
      query(
        collection(db, "conversations"),
        where("members", "array-contains", user.uid)
      ),
      (snap) =>
        setConversations(
          snap.docs.map((convoDoc) => convoDoc.data() as Conversation)
        )
    );

    return () => {
      unsubUsers();
      unsubConvo();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // if less than 24 hours use previous location -->
    // Solves problem with browsers that ask each time
    if (Timestamp.now().seconds - user.location.timestamp < 86400) return;

    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(
        (res) => {
          const { latitude: lat, longitude: lon } = res.coords;
          if (lat === user.location.lat && lon === user.location.lon) return;
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, {
            location: { lat, lon, timestamp: Timestamp.now().seconds },
          });
        },
        (err) => {
          console.error(err);
        }
      );
  }, [user]);

  return (
    <UsersProvider value={users}>
      <ConversationsProvider value={conversations}>
        <StyledMain>
          <Switch>
            <Route exact path="/">
              <Feed />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/chat">
              <Chat />
            </Route>
          </Switch>
          <NavBar />
        </StyledMain>
      </ConversationsProvider>
    </UsersProvider>
  );
};

export default Main;
