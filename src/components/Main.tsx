import { getAuth, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import styled from "styled-components";
import { Location } from "../types";
import { db } from "../App";
import UserContext from "../context/UserContext";
import Feed from "./Feed";
import Profile from "./Profile";
import Chat from "./Chat";

const Main = () => {
  const [geoloc, setGeoloc] = useState<Location | null>(null);
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(
        (res) => {
          const { latitude: lat, longitude: lon } = res.coords;
          if (lat === user.location.lat && lon === user.location.lon) return;
          console.log({ lat, lon });
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, {
            location: { lat, lon },
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }, [user]);

  return (
    <div>
      Main
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
      <button onClick={() => signOut(getAuth())}>Logout</button>
      <NavBar />
    </div>
  );
};

export default Main;
