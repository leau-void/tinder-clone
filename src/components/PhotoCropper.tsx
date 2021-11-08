import React from "react";
import styled from "styled-components";
import ModalMenu, { Section, TopButtonLeft, TopButtonSave } from "./ModalMenu";

const Canvas = styled.canvas``;

const PhotoCropper = ({
  editPhoto,
  setEditPhoto,
  handleSavePhoto,
}: {
  editPhoto: null | File;
  setEditPhoto: (val: null | File) => void;
  handleSavePhoto: () => void;
}) => {
  return (
    <ModalMenu
      title="Photo Editor"
      doOpen={editPhoto ? true : false}
      buttons={{
        left: (
          <TopButtonLeft onClick={() => setEditPhoto(null)}>
            Cancel
          </TopButtonLeft>
        ),
        right: (
          <TopButtonSave onClick={() => handleSavePhoto()}>Save</TopButtonSave>
        ),
      }}>
      <Section>
        <Canvas width={350} height={467}></Canvas>
      </Section>
    </ModalMenu>
  );
};

export default PhotoCropper;
