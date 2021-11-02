import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledNav = styled.nav``;

const Link = styled(NavLink)`
  color: black;
  &.active {
    color: blue;
  }
`;

const NavBar = () => {
  return (
    <StyledNav>
      <Link exact to="/" activeClassName="active">
        Feed
      </Link>
      <Link to="/profile" activeClassName="active">
        Profile
      </Link>
      <Link exact to="/chat" activeClassName="active">
        Chat
      </Link>
    </StyledNav>
  );
};

export default NavBar;
