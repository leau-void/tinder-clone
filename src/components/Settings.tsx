import React, { useContext, useEffect, useState } from "react";
import { signOut, getAuth } from "@firebase/auth";
import styled from "styled-components";
import { TopButtonLeft, TopButtonLogout } from "./TopButton";
import UserContext from "../context/UserContext";
import Slider from "./Slider";
import { db } from "../App";
import { updateDoc, doc } from "@firebase/firestore";
import Modal from "./Modal";

const Section = styled.section``;

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

  const handleClose = (func: (args?: any) => void, ...args: any) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    updateDoc(docRef, {
      settings: {
        minAge,
        maxAge,
        distance,
        global,
      },
    });

    func(...args);
  };

  return (
    <Modal
      title="Settings"
      doOpen={doOpen}
      buttons={[
        <TopButtonLeft onClick={() => handleClose(closeModal)}>
          Back
        </TopButtonLeft>,
        <TopButtonLogout onClick={() => handleClose(signOut, getAuth())}>
          Logout
        </TopButtonLogout>,
      ]}>
      <Section>
        <Label>Global</Label>
        <input
          checked={global}
          onChange={() => setGlobal(!global)}
          type="checkbox"
        />
        {global.toString()}
      </Section>
      <Section>
        <Label>Distance</Label>
        <Value>{distance}km</Value>
        <Slider hi={[distance, setDistance]} min={1} max={200} />
      </Section>
      <Section>
        <Label>Age</Label>
        <Value>
          {minAge} - {maxAge}
        </Value>
        <Slider
          lo={[minAge, setMinAge]}
          hi={[maxAge, setMaxAge]}
          min={18}
          max={100}
          minDiff={5}
          double
        />
      </Section>
    </Modal>
  );
};

export default Settings;
