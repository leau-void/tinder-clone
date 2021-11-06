import React from "react";
import styled from "styled-components";
import { JsxElement } from "typescript";
import Animate from "../utils/Animate";
import { animationOpenModal } from "../utils/animations";

const StyledModal = styled.main`
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

const Body = styled.section``;

interface Props {
  children: JSX.Element | JSX.Element[];
  buttons: JSX.Element | JSX.Element[];
  doOpen: boolean;
  title: string;
}

const Modal = ({ children, buttons, doOpen, title }: Props) => (
  <Animate {...{ doOpen, animationDuration: 300 }}>
    <StyledModal>
      <Header>
        {Array.isArray(buttons) ? buttons[0] : null}
        <Title>{title}</Title>
        {Array.isArray(buttons) ? buttons[1] : buttons}
      </Header>
      <Body>{children}</Body>
    </StyledModal>
  </Animate>
);

export default Modal;
