import { doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router";
import NavBar from "./NavBar";
import styled from "styled-components";
import { Location } from "../types";
import { db } from "../App";
import UserContext from "../context/UserContext";
import Feed from "./Feed";
import Profile from "./Profile";
import Chat from "./Chat";
import { Timestamp } from "firebase/firestore";

const Main = () => {
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    // if less than 24 hours use previous location --> Solves problem with browsers that ask each time
    if (Timestamp.now().seconds - user.location.timestamp < 86400) return;

    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(
        (res) => {
          const { latitude: lat, longitude: lon } = res.coords;
          if (lat === user.location.lat && lon === user.location.lon) return;
          console.log({ lat, lon });
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, {
            location: { lat, lon, timestamp: Timestamp.now().seconds },
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
      <NavBar />
    </div>
  );
};

export default Main;
