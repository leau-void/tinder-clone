import React, { useRef, SyntheticEvent } from "react";
import styled from "styled-components";
import { Photo } from "../types";

// photos are 150/200 on mobile (on profile) and can scale up to 350/467 for desktop

const StyledCard = styled.div`
  width: 100px;
  height: 134px;
  position: relative;
  border-radius: 8px;
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundAdd = styled.div`
  width: 60px;
  height: 60px;
  background: darkgrey;
  clip-path: polygon(
    0% 45%,
    0% 55%,
    45% 55%,
    45% 100%,
    55% 100%,
    55% 55%,
    100% 55%,
    100% 45%,
    55% 45%,
    55% 0%,
    45% 0%,
    45% 45%
  );
`;

const PhotoImg = styled.img`
  width: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const FileInput = styled.input.attrs((props) => ({
  type: "file",
  accept: "image/*",
}))`
  opacity: 0;
  max-width: 1px;
  max-height: 1px;
`;

const CornerButton = styled.button`
  min-width: 30px;
  width: 30px;
  min-height: 30px;
  height: 30px;
  background: blue;
  display: block;
  font-size: 1.3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  position: absolute;
  bottom: -15px;
  right: -15px;
  z-index: 1;
  border: 0;

  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: #f5f5f5;
    position: absolute;
    border-radius: 4px;
    transform-origin: center center;
  }

  &::after {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: #f5f5f5;
    transform-origin: center center;
    transform: rotate(90deg);
    position: absolute;
    border-radius: 4px;
  }
`;

const RemovePhotoButton = styled(CornerButton)`
  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(135deg);
  }
`;

const PhotoCard = ({
  cur,
  i,
  handlerAdd,
  handlerRemove,
  handleMove,
}: {
  cur: Photo | null;
  i: number;
  handlerAdd: (e: SyntheticEvent) => void;
  handlerRemove: (i: number) => void;
  handleMove: (e: SyntheticEvent) => void;
}) => {
  const input = useRef<HTMLInputElement>(null);

  const clickAddButton = (e: SyntheticEvent) => {
    e.stopPropagation();

    if (!input.current) return;

    input.current.click();
  };

  return (
    <StyledCard onClick={cur ? undefined : clickAddButton}>
      {cur ? (
        <>
          <PhotoImg
            onTouchStart={handleMove}
            onMouseDown={handleMove}
            src={cur.src}></PhotoImg>
          <RemovePhotoButton onClick={() => handlerRemove(i)} />
        </>
      ) : (
        <>
          <BackgroundAdd />
          <FileInput ref={input} onChange={handlerAdd} id={"input-" + i} />
          <CornerButton onClick={clickAddButton} />
        </>
      )}
    </StyledCard>
  );
};

export default PhotoCard;
