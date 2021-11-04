import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPen } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Settings from "./Settings";
import EditProfile from "./EditProfile";

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.7rem;
  color: grey;

  &:hover {
    color: #46cdcf;
  }
`;

const Button = styled.button`
  background: 0;
  border: 0;
`;

const Profile = () => {
  const [whichModalOpen, setWhichModalOpen] = useState<
    null | "settings" | "edit"
  >(null);

  const closeModal = () => setWhichModalOpen(null);

  return (
    <div>
      Profile
      <Button onClick={() => setWhichModalOpen("settings")}>
        <Icon icon={faCog} />
      </Button>
      <Button onClick={() => setWhichModalOpen("edit")}>
        <Icon icon={faPen} />
      </Button>
      <Settings
        doOpen={whichModalOpen === "settings"}
        closeModal={closeModal}
      />
      <EditProfile doOpen={whichModalOpen === "edit"} closeModal={closeModal} />
    </div>
  );
};

export default Profile;
