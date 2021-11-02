import {
  getAuth,
  signInAnonymously,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router";
import UserContext from "../context/UserContext";
import styled from "styled-components";

const Login = () => {
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
      Login
      {user && <Redirect to="/" />}
      <button id="sign-in-phone">SignIn phone</button>
      <button onClick={() => signInAnonymously(getAuth())}>Login</button>
    </div>
  );
};

export default Login;
