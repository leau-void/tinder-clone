import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import { Photo } from "../types";

const StyledCard = styled.div`
  width: 200px;
  height: 350px;
  position: relative;
  border-radius: 8px;
  background: grey;
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AddPhoto = styled.input.attrs((props) => ({
  type: "file",
  accept: "image/*",
}))`
  opacity: 0;
`;

const AddPhotoButton = styled.label`
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
  z-index: 99;

  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: white;
    position: absolute;
    border-radius: 4px;
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

const RemovePhotoButton = styled.button`
  min-width: 30px;
  width: 30px;
  min-height: 30px;
  height: 30px;
  background: royalblue;
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
  z-index: 99;
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
    transform: rotate(45deg);
  }

  &::after {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: white;
    transform-origin: center center;
    transform: rotate(135deg);
    position: absolute;
    border-radius: 4px;
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
  handlerAdd: ({ i, e }: { i: number; e: SyntheticEvent }) => void;
  handlerRemove: ({ i }: { i: number }) => void;
}) => {
  return (
    <StyledCard>
      {cur ? (
        <>
          <PhotoImg src={cur.src}></PhotoImg>
          <RemovePhotoButton onClick={() => handlerRemove({ i })} />
        </>
      ) : (
        <>
          <AddPhoto onChange={(e) => handlerAdd({ e, i })} id={"input-" + i} />
          <AddPhotoButton htmlFor={"input-" + i} />
        </>
      )}
    </StyledCard>
  );
};

export default PhotoCard;
