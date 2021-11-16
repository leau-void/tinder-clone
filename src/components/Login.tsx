import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
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

const StyledLogin = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
`;

const Title = styled.h3`
  margin: 1rem 0;
`;

const Subtitle = styled.h5`
  margin: 0.5rem 0;
`;

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
  border: 2px solid;
  color: #424242;

  &:hover {
    color: #3d84a8;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  width: 30px;
  height: 100%;
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
      <ButtonContainer>
        <LoginButton onClick={() => toggleIsPhoneModalOpen()}>
          <Icon icon={faMobileAlt} />
          <Label>Log in with phone number</Label>
        </LoginButton>
        {isPhoneModalOpen && <PhoneLoginModal />}
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
      <div style={{ maxWidth: "80%", textAlign: "center", padding: "0.25rem" }}>
        Using a guest account will create a populated profile for you, but you
        will still be able to edit the profile and use all of the app's
        functionalities.
      </div>
      <div style={{ maxWidth: "80%", textAlign: "center", padding: "0.25rem" }}>
        Unless you log out of the account, it will remain accessible. Use the
        other log in methods to backup your account.
      </div>
    </StyledLogin>
  );
};

export default Login;
