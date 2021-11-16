import React, { useEffect, useRef, useState } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import styled from "styled-components";
import "react-phone-number-input/style.css";
import PhoneInput, { Value } from "react-phone-number-input";

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  color: #424242;
`;

const Label = styled.label`
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
`;

const Input = styled.input`
  margin: 0.5rem 0;
`;

const Button = styled.button`
  border-radius: 100px;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 2px solid;
  color: #424242;
  width: 100%;

  &:hover {
    color: #3d84a8;
  }
`;

const PhoneLoginModal = () => {
  const [phoneNumber, setPhoneNumber] = useState<Value | undefined>();
  const captcha = useRef<RecaptchaVerifier>();
  const [loginResult, setLoginResult] = useState<ConfirmationResult | null>(
    null
  );
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState("");

  const trySignIn = () => {
    if (!captcha.current || !phoneNumber) return;
    signInWithPhoneNumber(getAuth(), phoneNumber.toString(), captcha.current)
      .then((confirmationResult) => {
        setLoginResult(confirmationResult);
      })
      .catch(console.error);
  };

  const handleCaptcha = (c: RecaptchaVerifier) => {
    captcha.current = c;
    captcha.current.render();
  };

  useEffect(() => {
    if (captcha.current) {
      return;
    }

    handleCaptcha(
      new RecaptchaVerifier(
        "login-phone",
        {
          size: "invisible",
        },
        getAuth()
      )
    );

    return () => {
      if (captcha.current) captcha.current.clear();
    };
  }, []);

  return (
    <Modal>
      <Label>Phone Number</Label>

      <PhoneInput value={phoneNumber} onChange={setPhoneNumber} type="phone" />
      <Button id="login-phone" onClick={() => trySignIn()}>
        Send code
      </Button>

      {loginResult && (
        <Modal>
          <Label>Verif Code</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="phone"
          />
          {codeErr && <div>{codeErr}</div>}
          <Button
            onClick={() =>
              loginResult
                .confirm(code)
                .catch((err) => {
                  console.error(err);
                  if (err.code === "auth/invalid-verification-code")
                    setCodeErr("Invalid verificaion code. Try again.");
                })
                .finally(() => setCode(""))
            }>
            Validate
          </Button>
        </Modal>
      )}
    </Modal>
  );
};

export default PhoneLoginModal;
