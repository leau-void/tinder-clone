import { getAuth, signOut } from "@firebase/auth";
import React from "react";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.7rem;
  color: grey;

  &:hover {
    color: #46cdcf;
  }
`;

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
      <Link to="/settings">
        <Icon icon={faCog} />
      </Link>
      <NavBar />
    </div>
  );
};

export default Main;
