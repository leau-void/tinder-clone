import React, { SyntheticEvent, useContext } from "react";
import styled from "styled-components";
import { TopButtonLeft, TopButtonSave } from "./TopButton";
import UserContext from "../context/UserContext";
import Modal from "./Modal";

const EditProfile = ({
  doOpen,
  closeModal,
}: {
  doOpen: boolean;
  closeModal: () => void;
}) => {
  const user = useContext(UserContext);

  const handleUpload = (e: SyntheticEvent) => {
    console.log(e);
  };

  return (
    <Modal
      title="Edit info"
      doOpen={doOpen}
      buttons={[
        <TopButtonLeft onClick={() => closeModal()}>Back</TopButtonLeft>,
        <TopButtonSave onClick={() => {}}>Save</TopButtonSave>,
      ]}>
      <input type="file" accept="image/*" multiple onChange={handleUpload} />
    </Modal>
  );
};

export default EditProfile;
