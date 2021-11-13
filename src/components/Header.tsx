import React from "react";
import icon from "../assets/icons/waves-blue.png";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  height: 8vh;
`;

const Title = styled.h1`
  margin: 0;
  margin-right: 1rem;
`;

const Icon = styled.img.attrs((props) => ({
  src: props.src,
  alt: "Waves App Logo",
  width: 50,
}))``;

const Header = () => (
  <StyledHeader>
    <Title>Waves</Title>
    <Icon src={icon} width={50} />
  </StyledHeader>
);

export default Header;
