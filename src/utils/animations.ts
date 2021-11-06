import styled, { css, keyframes } from "styled-components";

const openModal = keyframes`
0% {
  top: 100vh;
}
100% {
  top: 0;
}
`;

const animationOpenModal = css`
  ${openModal} 0.3s ease-in-out forwards
`;

export { animationOpenModal };
