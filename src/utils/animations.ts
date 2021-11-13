import styled, { css, keyframes } from "styled-components";

const openModalVert = keyframes`
0% {
  top: 100vh;
}
100% {
  top: 0;
}
`;

const animationOpenModalVert = css`
  ${openModalVert} 0.3s ease-in-out forwards
`;

const openModalHor = keyframes`
0% {
  left: 100vw;
}
100% {
  left: 0;
}
`;

const animationOpenModalHor = css`
  ${openModalHor} 0.3s ease-in-out forwards
`;

export { animationOpenModalVert, animationOpenModalHor };
