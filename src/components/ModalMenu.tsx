import React from "react";
import styled from "styled-components";
import Animate from "../utils/Animate";
import { animationOpenModal } from "../utils/animations";

const StyledModal = styled.div`
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  z-index: 99;
  top: 0;
  background: lightgrey;
  animation: ${animationOpenModal};

  &.closing-setup {
    animation: none;
  }
  &.closing {
    animation: ${animationOpenModal};
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

const Body = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  children: JSX.Element | JSX.Element[];
  buttons: { left: JSX.Element; right: JSX.Element };
  doOpen: boolean;
  title: string;
}

const ModalMenu = ({ children, buttons, doOpen, title }: Props) => (
  <Animate {...{ doOpen, animationDuration: 300 }}>
    <StyledModal>
      <Header>
        {buttons.left ? buttons.left : null}
        <Title>{title}</Title>
        {buttons.right ? buttons.right : null}
      </Header>
      <Body>{children}</Body>
    </StyledModal>
  </Animate>
);

export default ModalMenu;
