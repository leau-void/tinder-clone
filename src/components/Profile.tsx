import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPen } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Settings from "./Settings";
import EditProfile from "./EditProfile";
import UserContext from "../context/UserContext";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";

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

const UserPhoto = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
`;

const Profile = () => {
  const [whichModalOpen, setWhichModalOpen] = useState<
    null | "settings" | "edit"
  >(null);

  const user = useContext(UserContext);

  const closeModal = () => setWhichModalOpen(null);

  return (
    <div>
      <UserPhoto
        src={
          user
            ? user.profile.photos[0]
              ? user.profile.photos[0].src
              : userPlaceholder
            : userPlaceholder
        }></UserPhoto>
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
