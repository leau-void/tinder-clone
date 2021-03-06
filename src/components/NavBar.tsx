import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faUser } from "@fortawesome/free-solid-svg-icons";
import wavesLogo from "../assets/icons/waves-black.png";

const StyledNav = styled.nav`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  position: absolute;
  bottom: 0;
  height: 8vh;

  @media (min-height: 650px) {
    height: 10vh;
  }
`;

const Link = styled(NavLink)`
  color: unset;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: grey;

  .active & {
    color: #46cdcf;
  }
`;

const Logo = styled.img`
  width: 2.2em;
  height: 2.2em;
  filter: invert(39%) sepia(97%) saturate(0%) hue-rotate(213deg)
    brightness(107%) contrast(113%);

  .active & {
    filter: invert(98%) sepia(85%) saturate(6941%) hue-rotate(139deg)
      brightness(87%) contrast(83%);
  }
`;

const NavBar = () => {
  return (
    <StyledNav>
      <Link exact to="/" activeClassName="active">
        <Logo src={wavesLogo} />
      </Link>
      <Link exact to="/chat" activeClassName="active">
        <Icon size="2x" icon={faComments} />
      </Link>
      <Link to="/profile" activeClassName="active">
        <Icon size="2x" icon={faUser} />
      </Link>
    </StyledNav>
  );
};

export default NavBar;
