import React, { SyntheticEvent, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { TopButtonLeft, TopButtonSave } from "./TopButton";
import UserContext from "../context/UserContext";
import ModalMenu from "./ModalMenu";

const Label = styled.label``;

const Value = styled.div``;

const Input = styled.input``;

const TextArea = styled.textarea``;

const Section = styled.section`
  width: 100%;
`;

// interface Profile {
//   name: string;
//   age: number;
//   description: string;
//   photos: Photo[];
//   city: string;
//   gender: string;
//   orientation: string;
//   passions: string[];
// }

const EditProfile = ({
  doOpen,
  closeModal,
}: {
  doOpen: boolean;
  closeModal: () => void;
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(25);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [passionInput, setPassionInput] = useState("");
  const [passions, setPassions] = useState<string[]>([]);

  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    setName(user.profile.name);
    setAge(user.profile.age);
    setDescription(user.profile.description);
    setCity(user.profile.city);
    setGender(user.profile.gender);
    setOrientation(user.profile.orientation);
    setPassions(user.profile.passions);
  }, [user]);

  const handleUpload = (e: SyntheticEvent) => {
    console.log(e);
  };

  return (
    <ModalMenu
      title="Edit info"
      doOpen={doOpen}
      buttons={{
        left: <TopButtonLeft onClick={() => closeModal()}>Back</TopButtonLeft>,
        right: <TopButtonSave onClick={() => {}}>Save</TopButtonSave>,
      }}>
      <>
        <Section>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
          />
        </Section>
        <Section>
          <Label>NAME</Label> <Input value={name} />
        </Section>
        <Section>
          <Label>AGE</Label> <Input value={age} type="number" />
        </Section>
        <Section>
          <Label>ABOUT ME</Label> <TextArea value={description} />
        </Section>
        <Section>
          <Label>LIVING IN</Label> <Input value={city} />
        </Section>
        <Section>
          <Label>GENDER</Label> <Input value={gender} />
        </Section>
        <Section>
          <Label>SEXUAL ORIENTATION</Label> <Input value={orientation} />
        </Section>
        <Section>
          <Label>PASSIONS</Label> <Input value={passionInput} />
          {passions.map((passion, i) => (
            <div key={i}>{passion}</div>
          ))}
        </Section>
      </>
    </ModalMenu>
  );
};

export default EditProfile;
