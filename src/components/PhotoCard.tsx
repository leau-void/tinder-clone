import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import { Photo } from "../types";

// photos are 150/200 on mobile and can scale up to 350/467 for desktop

const StyledCard = styled.div`
  width: 225px;
  height: 300px;
  position: relative;
  border-radius: 8px;
  background: grey;
`;

const PhotoImg = styled.img`
  width: 100%;
  object-fit: contain;
`;

const AddPhoto = styled.input.attrs((props) => ({
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
    background: white;
    position: absolute;
    border-radius: 4px;
    transform-origin: center center;
  }

  &::after {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: white;
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
}: {
  cur: Photo | null;
  i: number;
  handlerAdd: (e: SyntheticEvent) => void;
  handlerRemove: (i: number) => void;
}) => {
  return (
    <StyledCard>
      {cur ? (
        <>
          <PhotoImg src={cur.src}></PhotoImg>
          <RemovePhotoButton onClick={() => handlerRemove(i)} />
        </>
      ) : (
        <>
          <AddPhoto onChange={handlerAdd} id={"input-" + i} />
          <CornerButton
            onClick={(e) =>
              (
                (e.target as HTMLElement)
                  .previousElementSibling as HTMLInputElement
              ).click()
            }
          />
        </>
      )}
    </StyledCard>
  );
};

export default PhotoCard;
