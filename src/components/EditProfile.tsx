import React from "react";
import styled from "styled-components";
import Animate from "../utils/Animate";

const TopButton = styled.button``;

const EditProfile = ({
  doOpen,
  closeModal,
}: {
  doOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Animate {...{ doOpen, animationDuration: 400 }}>
      <div>
        EditProfile
        <TopButton onClick={() => closeModal()}>Back</TopButton>
        <TopButton onClick={() => {}}>Save</TopButton>
      </div>
    </Animate>
  );
};

export default EditProfile;
