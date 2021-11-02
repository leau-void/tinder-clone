import { getAuth, signOut } from "@firebase/auth";
import React from "react";
import Header from "./Header";
import { Switch, Route } from "react-router";
import NavBar from "./NavBar";

const Main = () => {
  return (
    <div>
      <Header />
      Main
      <Switch>
        <Route exact path="/">
          Feed
        </Route>
        <Route exact path="/profile">
          Profile
        </Route>
        <Route exact path="/chat">
          Chat
        </Route>
      </Switch>
      <button onClick={() => signOut(getAuth())}>Logout</button>
      <NavBar />
    </div>
  );
};

export default Main;
