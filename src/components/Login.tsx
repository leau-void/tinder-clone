import {
  getAuth,
  signInAnonymously,
  signInWithPhoneNumber,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";
import React, { useCallback, useContext } from "react";
import { Redirect } from "react-router";
import UserContext from "../context/UserContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGooglePlus,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faMobileAlt, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import useBoolToggle from "../hooks/useBoolToggle";
import PhoneLoginModal from "./PhoneLoginModal";

const StyledLogin = styled.main``;

const Title = styled.h3``;

const Subtitle = styled.h5``;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  align-items: stretch;
`;

const LoginButton = styled.button`
  border-radius: 100px;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  justify-items: center;
  margin: 0.5rem 0;
`;

const Icon = styled(FontAwesomeIcon)`
  width: 30px;
`;

const Label = styled.span`
  padding: 0.5rem;
  width: 100%;
  text-align: center;
`;

const Login = () => {
  const user = useContext(UserContext);
  const [isPhoneModalOpen, toggleIsPhoneModalOpen] = useBoolToggle(false);

  const loginHandler = useCallback((thirdParty) => {
    const provider =
      thirdParty === "facebook"
        ? new FacebookAuthProvider()
        : thirdParty === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    signInWithPopup(getAuth(), provider).catch(() => null);
  }, []);

  return (
    <StyledLogin>
      {user && <Redirect to="/" />}
      <Title>GET STARTED</Title>
      <Subtitle>Start meeting interesting people today.</Subtitle>
      {isPhoneModalOpen && <PhoneLoginModal />}
      <ButtonContainer>
        <LoginButton onClick={() => toggleIsPhoneModalOpen()}>
          <Icon icon={faMobileAlt} />
          <Label>Log in with phone number</Label>
        </LoginButton>
        <LoginButton onClick={() => loginHandler("facebook")}>
          <Icon icon={faFacebook} />
          <Label>Log in with Facebook</Label>
        </LoginButton>
        <LoginButton onClick={() => loginHandler("google")}>
          <Icon icon={faGooglePlus} />
          <Label>Log in with Google</Label>
        </LoginButton>
        <LoginButton onClick={() => loginHandler("github")}>
          <Icon icon={faGithub} />
          <Label>Log in with Github</Label>
        </LoginButton>
        <LoginButton onClick={() => signInAnonymously(getAuth())}>
          <Icon icon={faUserSecret} />
          <Label>Log in as Guest</Label>
        </LoginButton>
      </ButtonContainer>
    </StyledLogin>
  );
};

export default Login;
