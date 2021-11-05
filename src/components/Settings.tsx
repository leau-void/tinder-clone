import React, { useContext, useEffect, useState } from "react";
import { signOut, getAuth } from "@firebase/auth";
import styled, { css, keyframes } from "styled-components";
import Animate from "../utils/Animate";
import TopButton from "./TopButton";
import UserContext from "../context/UserContext";
import { User } from "../types";
import DoubleSlider from "./DoubleSlider";
import SingleSlider from "./SingleSlider";
import { db } from "../App";
import { updateDoc, doc } from "@firebase/firestore";

const animationOpenModal = keyframes`
0% {
  top: 100vh;
}
100% {
  top: 0;
}
`;

const animationRuleOpenModal = css`
  ${animationOpenModal} 0.3s ease-in-out forwards
`;

const Modal = styled.div`
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  z-index: 99;
  top: 0;
  background: lightgrey;
  animation: ${animationRuleOpenModal};

  &.closing-setup {
    animation: none;
  }
  &.closing {
    animation: ${animationRuleOpenModal};
    animation-direction: reverse;
  }
`;

const Header = styled.header`
  width: 100%;
  display: grid;
  grid-template-columns: 0.3fr 1fr 0.3fr;
  background: grey;
  text-align: center;
`;

const Title = styled.h3`
  font-weight: 400;
`;

const TopButtonLeft = styled(TopButton)``;

const TopButtonLogout = styled(TopButton)``;

const Body = styled.main``;

const Section = styled.section``;

const Label = styled.label``;

const Settings = ({
  doOpen,
  closeModal,
}: {
  doOpen: boolean;
  closeModal: () => void;
}) => {
  const [minAge, setMinAge] = useState(25);
  const [maxAge, setMaxAge] = useState(75);
  const [distance, setDistance] = useState(100);
  const [global, setGlobal] = useState(true);

  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    setMinAge(user.settings.minAge);
    setMaxAge(user.settings.maxAge);
  }, [user]);

  const handleClose = (func: (args?: any) => void, ...args: any) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    updateDoc(docRef, {
      settings: {
        minAge,
        maxAge,
        distance,
        global,
      },
    });

    func(...args);
  };

  return (
    <Animate {...{ doOpen, animationDuration: 300 }}>
      <Modal>
        <Header>
          <TopButtonLeft onClick={() => handleClose(closeModal)}>
            Back
          </TopButtonLeft>
          <Title>Settings</Title>
          <TopButtonLogout onClick={() => handleClose(signOut, getAuth())}>
            Logout
          </TopButtonLogout>
        </Header>
        <Body>
          <Section>
            <Label></Label>
          </Section>
          <Section>
            <Label>Distance</Label>
            <SingleSlider
              limits={[1, 100]}
              values={[1, distance]}
              valueSetters={[(n: number) => {}, setDistance]}
            />
          </Section>
          <Section>
            <Label>Age</Label>
            <DoubleSlider
              values={[minAge, maxAge]}
              valueSetters={[setMinAge, setMaxAge]}
              limits={[18, 100]}
              minDiff={5}
            />
          </Section>
        </Body>
      </Modal>
    </Animate>
  );
};

export default Settings;
