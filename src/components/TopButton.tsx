import styled from "styled-components";

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

export default TopButton;

export { TopButtonLeft, TopButtonSave, TopButtonLogout };
