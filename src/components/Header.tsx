import React from "react";
import icon from "../assets/icons/waves-blue.png";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  height: 8vh;
`;

const Title = styled.h1`
  margin: 0 0.5rem 0 1rem;
  font-size: 1.7rem;
`;

const Icon = styled.img.attrs((props) => ({
  src: props.src,
  alt: "Waves App Logo",
  width: 40,
}))``;

const Header = () => (
  <StyledHeader>
    <Title>waves</Title>
    <Icon src={icon} />
  </StyledHeader>
);

export default Header;
