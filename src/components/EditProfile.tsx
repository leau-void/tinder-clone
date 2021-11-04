import React, { useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import Animate from "../utils/Animate";
import TopButton from "./TopButton";
import UserContext from "../context/UserContext";

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

const Modal = styled.main`
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

const Body = styled.section``;

const EditProfile = ({
  doOpen,
  closeModal,
}: {
  doOpen: boolean;
  closeModal: () => void;
}) => {
  const user = useContext(UserContext);

  return (
    <Animate {...{ doOpen, animationDuration: 300 }}>
      <Modal>
        <Header>
          <TopButtonLeft onClick={() => closeModal()}>Back</TopButtonLeft>
          <Title>Edit info</Title>
          <TopButtonLogout onClick={() => {}}>Save</TopButtonLogout>
        </Header>
        <Body></Body>
      </Modal>
    </Animate>
  );
};

export default EditProfile;
