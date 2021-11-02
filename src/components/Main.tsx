import { getAuth, signOut } from "@firebase/auth";
import React from "react";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const Main = () => {
  return (
    <div>
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
      <Link to="/settings">Settings</Link>
      <NavBar />
    </div>
  );
};

export default Main;
