import styled from "styled-components";

interface IconProps {
  src: string;
  width?: string;
  height?: string;
}

const UserIcon = styled.div`
  border-radius: 50%;
  position: relative;
  background: center / cover no-repeat url(${(props: IconProps) => props.src});
  width: ${(props: IconProps) => props.width || "100px"};
  height: ${(props: IconProps) => props.height || "100px"};
  cursor: pointer;

  &.not-seen {
    &::after {
      content: "";
      display: block;
      width: 20%;
      height: 20%;
      background: royalblue;
      position: absolute;
      border-radius: 50%;
      bottom: 5%;
      right: 5%;
    }
  }
`;

export default UserIcon;
