import {
  getAuth,
  signInAnonymously,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router";
import UserContext from "../context/UserContext";
import { Switch, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import Login from "./Login";
import Signup from "./Signup";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "../firebase-config";

const Link = styled(NavLink)`
  color: black;

  &.active {
    color: blue;
  }
`;

const Auth = () => {
  initializeApp(firebaseConfig);

  const user = useContext(UserContext);

  const wrapper = (captcha: any) => {
    signInWithPhoneNumber(getAuth(), "+15145616181", captcha)
      .then((confirmationResult) => {
        const text: string = prompt("code") as string;
        confirmationResult.confirm(text);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const captcha = new RecaptchaVerifier(
      "sign-in-phone",
      {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("done");

          wrapper(captcha);
        },
      },
      getAuth()
    );
    captcha.render();

    return () => captcha.clear();
  }, []);

  return (
    <div>
      Auth
      {user && <Redirect to="/" />}
      <Switch>
        <Route exact path="/login/">
          <Login />
        </Route>
        <Route exact path="/login/signup">
          <Signup />
        </Route>
      </Switch>
      <button id="sign-in-phone">SignIn phone</button>
      <button onClick={() => signInAnonymously(getAuth())}>Login</button>
      <nav>
        <Link exact to="/login/" activeClassName="active">
          Login
        </Link>
        <Link to="/login/signup" activeClassName="active">
          Signup
        </Link>
      </nav>
    </div>
  );
};

export default Auth;
