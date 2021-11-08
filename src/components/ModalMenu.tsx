import React from "react";
import styled from "styled-components";
import Animate from "../utils/Animate";
import { animationOpenModal } from "../utils/animations";

const StyledModal = styled.div`
  position: absolute;
  min-height: 100vh;
  width: 100%;
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

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubSection = styled.div``;

const SectionLabel = styled.label``;

const TopButton = styled.button`
  border-radius: 8px;
  align-self: center;
  width: fit-content;
  padding: 0.5rem;
  border: 2px solid black;
`;

const TopButtonLeft = styled(TopButton)`
  position: relative;
  left: 50%;
  z-index: 2;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: -4px;
    left: 3px;
    width: 34px;
    height: 34px;
    border-radius: inherit;
    transform-origin: top left;
    transform: rotate(45deg);
    z-index: -1;
    background-color: inherit;
    border-left: inherit;
    border-bottom: inherit;
  }
`;

const TopButtonSave = styled(TopButton)``;

const TopButtonLogout = styled(TopButton)``;

export default ModalMenu;

export {
  Section,
  SubSection,
  SectionLabel,
  TopButton,
  TopButtonLeft,
  TopButtonSave,
  TopButtonLogout,
};
