import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import Animate from "../utils/Animate";
import {
  animationOpenModalVert,
  animationOpenModalHor,
} from "../utils/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface StyledProps {
  animation?: "vertical" | "horizontal";
}
const StyledModal = styled.div`
  position: fixed;
  min-height: 100vh;
  width: 100%;
  z-index: 99;
  top: 0;
  left: 0;
  background: lightgrey;
  animation: ${({ animation }: StyledProps) =>
    animation
      ? animation === "vertical"
        ? animationOpenModalVert
        : animationOpenModalHor
      : "none"};

  &.closing-setup {
    animation: none;
  }
  &.closing {
    animation: ${({ animation }: StyledProps) =>
      animation
        ? animation === "vertical"
          ? animationOpenModalVert
          : animationOpenModalHor
        : "none"};
    animation-direction: reverse;
  }
`;

const Header = styled.header`
  width: 100%;
  display: grid;
  grid-template-columns: 0.3fr 1fr 0.3fr;
  background: #fafafa;
  place-items: center;
  height: 8vh;
`;

const Title = styled.h3`
  font-weight: 400;
  margin: 0;
`;

const Body = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  children: JSX.Element | JSX.Element[];
  buttons: { left?: JSX.Element; right?: JSX.Element };
  doOpen: boolean;
  title: string;
  animation?: "vertical" | "horizontal";
}

const ModalMenu = ({ children, buttons, doOpen, title, animation }: Props) => (
  <Animate {...{ doOpen, animationDuration: 300 }}>
    <StyledModal animation={animation}>
      <Header>
        {buttons.left ? buttons.left : <div></div>}
        <Title>{title}</Title>
        {buttons.right ? buttons.right : <div></div>}
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
  width: 100%;
  background: #fafafa;
  margin: 1rem 0;
`;

const SubSection = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const SectionLabel = styled.label``;

interface ButtonStyleProps {
  color?: string;
  background?: string;
}

const TopButton = styled.button`
  align-self: center;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  color: ${(props: ButtonStyleProps) => props.color || "#424242"};
  background: ${(props: ButtonStyleProps) => props.background || "transparent"};
`;

const Icon = styled(FontAwesomeIcon)`
  color: inherit;
`;

interface ButtonProps {
  onClick: (() => void) | ((e: SyntheticEvent) => void);
}

const TopButtonBack = ({ onClick }: ButtonProps) => (
  <TopButton onClick={onClick}>
    <Icon size="lg" icon={faChevronLeft} />
  </TopButton>
);

const TopButtonDone = ({ onClick }: ButtonProps) => (
  <TopButton color="#3D84A8" onClick={onClick}>
    Done
  </TopButton>
);

const TopButtonLogout = ({ onClick }: ButtonProps) => (
  <TopButton color="#960000" onClick={onClick}>
    Logout
  </TopButton>
);

export default ModalMenu;

export {
  Section,
  SubSection,
  SectionLabel,
  TopButton,
  TopButtonBack,
  TopButtonDone,
  TopButtonLogout,
};
