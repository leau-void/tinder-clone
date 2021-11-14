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
  TopButtonDone,
  TopButtonLogout,
} from "./ModalMenu";

const Label = styled.label``;

const Value = styled.div``;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  :checked + & {
    background-color: #2196f3;

    &::before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  }

  :focus + & {
    box-shadow: 0 0 1px #2196f3;
  }
`;

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
  console.log(global);
  return (
    <ModalMenu
      title="Settings"
      doOpen={doOpen}
      buttons={{
        right: <TopButtonDone onClick={() => handleClose(closeModal)} />,
      }}
      animation="vertical">
      <>
        <Section>
          <SubSection>
            <Label>Global</Label>

            <Switch htmlFor="global-checkbox">
              <Checkbox
                id="global-checkbox"
                onChange={() => setGlobal(!global)}
                type="checkbox"
                checked={global}
                value={global + ""}
              />
              <SwitchSlider />
            </Switch>
          </SubSection>
          <SubSection>
            <div style={{ width: "100%", textAlign: "center" }}>
              <small>Global mode is recommended as this is a test app.</small>
            </div>
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

        <Section>
          <SubSection>
            <TopButtonLogout onClick={() => handleClose(signOut, getAuth())} />
          </SubSection>
        </Section>
      </>
    </ModalMenu>
  );
};

export default Settings;
