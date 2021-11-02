import { getAuth, signInAnonymously } from "@firebase/auth";
import React, { useContext } from "react";
import { Redirect } from "react-router";
import UserContext from "../context/UserContext";
import { Switch, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import Login from "./Login";
import Signup from "./Signup";

const Link = styled(NavLink)`
  color: black;

  &.active {
    color: red;
  }
`;

const Auth = () => {
  const user = useContext(UserContext);
  return (
    <div>
      Auth
      {user && <Redirect to="/" />}
      <Switch>
        <Route exact strict path="/login/">
          <Login />
        </Route>
        <Route exact path="/login/s">
          <Signup />
        </Route>
      </Switch>
      <button onClick={() => signInAnonymously(getAuth())}>Auth</button>
      <nav>
        <Link strict exact to="/login/" activeClassName="active">
          Login
        </Link>
        <Link strict exact to="/login/s" activeClassName="active">
          Signup
        </Link>
      </nav>
    </div>
  );
};

export default Auth;
