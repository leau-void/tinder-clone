import React from "react";
import styled from "styled-components";
import Animate from "../utils/Animate";
import { animationOpenModal } from "../utils/animations";

interface StyledProps {
  fixed: boolean | undefined;
}

const StyledModal = styled.div`
  position: ${(props: StyledProps) => (props.fixed ? "fixed" : "absolute")};
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
  place-items: center;
  height: 10vh;
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
  fixed?: boolean;
}

const ModalMenu = ({ children, buttons, doOpen, title, fixed }: Props) => (
  <Animate {...{ doOpen, animationDuration: 300 }}>
    <StyledModal fixed={fixed}>
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
  padding: 0.6rem;
  border: 0;
`;

const TopButtonBack = styled(TopButton)`
  clip-path: polygon(
    2% 47%,
    2% 48%,
    0% 51%,
    1% 52%,
    2% 55%,
    25% 97%,
    28% 99%,
    30% 100%,
    87% 100%,
    99% 100%,
    100% 97%,
    100% 92%,
    100% 82%,
    100% 4%,
    99% 3%,
    99% 1%,
    95% 0%,
    31% 0%,
    28% 0%,
    27% 0%,
    24% 3%
  );

  padding-left: 1rem;
`;

const TopButtonSave = styled(TopButton)``;

const TopButtonLogout = styled(TopButton)``;

export default ModalMenu;

export {
  Section,
  SubSection,
  SectionLabel,
  TopButton,
  TopButtonBack,
  TopButtonSave,
  TopButtonLogout,
};
