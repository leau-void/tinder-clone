import React, { useContext, useEffect, useState } from "react";
import { signOut, getAuth } from "@firebase/auth";
import styled from "styled-components";
import UserContext from "../context/UserContext";
import Slider from "./Slider";
import { db } from "../App";
import { updateDoc, doc } from "@firebase/firestore";
import ModalMenu, {
  Section,
  SubSection,
  TopButtonLeft,
  TopButtonLogout,
} from "./ModalMenu";

const Label = styled.label``;

const Value = styled.div``;

const Settings = ({
  doOpen,
  closeModal,
}: {
  doOpen: boolean;
  closeModal: () => void;
}) => {
  const [minAge, setMinAge] = useState(25);
  const [maxAge, setMaxAge] = useState(75);
  const [distance, setDistance] = useState(100);
  const [global, setGlobal] = useState(true);

  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    setMinAge(user.settings.minAge);
    setMaxAge(user.settings.maxAge);
    setDistance(user.settings.distance);
    setGlobal(user.settings.global);
  }, [user]);

  const handleClose = (cb: (args?: any) => void, ...args: any) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    updateDoc(docRef, {
      settings: {
        minAge: minAge,
        maxAge: maxAge,
        distance: distance,
        global: global,
      },
    });

    cb(...args);
  };

  return (
    <ModalMenu
      title="Settings"
      doOpen={doOpen}
      buttons={{
        left: (
          <TopButtonLeft onClick={() => handleClose(closeModal)}>
            Back
          </TopButtonLeft>
        ),
        right: (
          <TopButtonLogout onClick={() => handleClose(signOut, getAuth())}>
            Logout
          </TopButtonLogout>
        ),
      }}>
      <>
        <Section>
          <SubSection>
            <Label>Global</Label>

            <input
              checked={global}
              onChange={() => setGlobal(!global)}
              type="checkbox"
            />
          </SubSection>
          <SubSection>
            <small>Global mode is recommended as this is a test app.</small>
          </SubSection>
        </Section>
        <Section>
          <SubSection>
            <Label>Distance</Label>
            <Value>{distance}km</Value>
          </SubSection>
          <SubSection>
            <Slider hi={[distance, setDistance]} min={1} max={200} />
          </SubSection>
        </Section>

        <Section>
          <SubSection>
            <Label>Age</Label>
            <Value>
              {minAge} - {maxAge}
            </Value>
          </SubSection>
          <SubSection>
            <Slider
              lo={[minAge, setMinAge]}
              hi={[maxAge, setMaxAge]}
              min={18}
              max={100}
              minDiff={5}
              double
            />
          </SubSection>
        </Section>
      </>
    </ModalMenu>
  );
};

export default Settings;
