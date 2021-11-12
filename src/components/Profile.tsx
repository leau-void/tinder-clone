import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPen } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Settings from "./Settings";
import EditProfile from "./EditProfile";
import UserContext from "../context/UserContext";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";

const StyledProfile = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: inherit;
`;

const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;

const LabelButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: grey;
`;

const Button = styled.button`
  background: 0;
  border: 0;
  padding: 8px;
  border: 2px solid;
  border-color: inherit;
  border-radius: 50%;
  margin-bottom: 4px;
  color: grey;

  &:hover {
    color: #46cdcf;
  }
`;

const UserPhoto = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin: 50px 0;
`;

const Profile = () => {
  const [whichModalOpen, setWhichModalOpen] = useState<
    null | "settings" | "edit"
  >(null);

  const user = useContext(UserContext);

  const closeModal = () => setWhichModalOpen(null);

  return (
    <StyledProfile>
      <UserPhoto
        src={
          user
            ? user.profile.photos[0]
              ? user.profile.photos[0].src
              : userPlaceholder
            : userPlaceholder
        }></UserPhoto>
      <ButtonWrap>
        <LabelButton>
          <Button onClick={() => setWhichModalOpen("settings")}>
            <Icon size="lg" icon={faCog} />
          </Button>
          SETTINGS
        </LabelButton>
        <LabelButton>
          <Button onClick={() => setWhichModalOpen("edit")}>
            <Icon size="lg" icon={faPen} />
          </Button>
          EDIT INFO
        </LabelButton>
      </ButtonWrap>
      <Settings
        doOpen={whichModalOpen === "settings"}
        closeModal={closeModal}
      />
      <EditProfile doOpen={whichModalOpen === "edit"} closeModal={closeModal} />
    </StyledProfile>
  );
};

export default Profile;
