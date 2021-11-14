import React, { useCallback, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import styled from "styled-components";
import useBoolToggle from "../hooks/useBoolToggle";

const Modal = styled.div``;

const Label = styled.label``;

const Input = styled.input``;

// TODO complete phone login flow

const PhoneLoginModal = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isSignInOk, toggleIsSignInOk] = useBoolToggle(false);
  const [captcha, setCaptcha] = useState<null | RecaptchaVerifier>(null);
  const [count, setCount] = useState(0);
  const [loginResult, setLoginResult] = useState<ConfirmationResult | null>(
    null
  );
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (!isSignInOk || !captcha) return;
    signInWithPhoneNumber(getAuth(), phoneNumber, captcha)
      .then((confirmationResult) => {
        setLoginResult(confirmationResult);
        //  .confirm(text).catch(console.log);
      })
      .catch(console.log);
  }, [isSignInOk, count, captcha]);

  useEffect(() => {
    const localCaptcha = new RecaptchaVerifier(
      "login-phone",
      {
        size: "invisible",
        callback: (response: any) => {
          toggleIsSignInOk(true);
        },
      },
      getAuth()
    );
    localCaptcha.render();
    setCaptcha(localCaptcha);

    return () => localCaptcha.clear();
  }, []);

  return (
    <Modal>
      <Label>Phone Number</Label>
      <Input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        type="phone"
      />
      <button id="login-phone" onClick={() => setCount(count + 1)}>
        Send code
      </button>

      {loginResult && (
        <Modal>
          <Label>Verif Code</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="phone"
          />
          <button onClick={() => loginResult.confirm(code).catch(console.log)}>
            Validate
          </button>
        </Modal>
      )}
    </Modal>
  );
};

export default PhoneLoginModal;
