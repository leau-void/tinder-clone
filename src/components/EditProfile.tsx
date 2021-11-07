import React, { SyntheticEvent, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { TopButtonLeft, TopButtonSave } from "./TopButton";
import UserContext from "../context/UserContext";
import ModalMenu from "./ModalMenu";
import PhotoCard from "./PhotoCard";
import validFileType from "../utils/validFileType";
import { Photo } from "../types";

const Tabs = styled.nav``;

const Tab = styled.button``;

const PhotoContainer = styled.div`
  display: grid;
  grid: repeat(3, 350px) / repeat(3, 200px);
  grid-gap: 20px;
`;

const Label = styled.label``;

const Value = styled.div``;

const Input = styled.input``;

const TextArea = styled.textarea``;

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form``;

const Submit = styled.button``;

const PassionsPreview = styled.div``;

const Passion = styled.div``;

const PassionName = styled.div``;

const DeletePassion = styled.button``;

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

interface EditPhoto {
  src: string;
  file?: File;
}

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

  const [photos, setPhotos] = useState<Array<null | EditPhoto>>(
    new Array(9).fill(null)
  );

  const [currentTab, setCurrentTab] = useState<"edit" | "preview">("edit");

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

    setPhotos(() =>
      photos.map((cur, i) =>
        user.profile.photos[i] ? user.profile.photos[i] : null
      )
    );
  }, [user]);

  const handleUpload = (e: SyntheticEvent) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files[0]) return;
    const file = files[0];
    if (!validFileType(file)) return;
    console.log(file);
    const newIndex = photos.findIndex((cur) => !cur);

    setPhotos([
      ...photos.slice(0, newIndex),
      {
        src: URL.createObjectURL(file),
        file: file,
      },
      ...photos.slice(newIndex + 1),
    ]);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setPassions([...passions, passionInput]);
    setPassionInput("");
  };

  return (
    <ModalMenu
      title="Edit info"
      doOpen={doOpen}
      buttons={{
        left: <TopButtonLeft onClick={() => closeModal()}>Back</TopButtonLeft>,
        right: <TopButtonSave onClick={() => {}}>Save</TopButtonSave>,
      }}>
      <Tabs>
        <Tab
          onClick={() => setCurrentTab("edit")}
          className={currentTab === "edit" ? "active" : ""}>
          Edit
        </Tab>
        <Tab
          onClick={() => setCurrentTab("preview")}
          className={currentTab === "preview" ? "active" : ""}>
          Preview
        </Tab>
      </Tabs>
      {currentTab === "edit" ? (
        <>
          <Section>
            <PhotoContainer>
              {photos.map((cur, i) => (
                <PhotoCard
                  key={i}
                  cur={cur}
                  i={i}
                  handlerAdd={handleUpload}
                  handlerRemove={(i: number) =>
                    setPhotos([
                      ...photos.slice(0, i),
                      ...photos.slice(i + 1),
                      null,
                    ])
                  }
                />
              ))}
            </PhotoContainer>
          </Section>
          <Section>
            <Label>NAME</Label>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </Section>
          <Section>
            <Label>AGE</Label>
            <Input
              onChange={(e) => setAge(Number(e.target.value))}
              value={age}
              type="number"
            />
          </Section>
          <Section>
            <Label>ABOUT ME</Label>
            <TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </Section>
          <Section>
            <Label>LIVING IN</Label>
            <Input onChange={(e) => setCity(e.target.value)} value={city} />
          </Section>
          <Section>
            <Label>GENDER</Label>
            <Input onChange={(e) => setGender(e.target.value)} value={gender} />
          </Section>
          <Section>
            <Label>SEXUAL ORIENTATION</Label>
            <Input
              onChange={(e) => setOrientation(e.target.value)}
              value={orientation}
            />
          </Section>
          <Section>
            <Label>PASSIONS</Label>
            <small>Share up to 5 passions</small>
            <Form onSubmit={handleSubmit}>
              <Input
                onChange={(e) => setPassionInput(e.target.value)}
                value={passionInput}
                required
              />
              <Submit type="submit" disabled={passions.length >= 5}>
                Add
              </Submit>
            </Form>
            <PassionsPreview>
              {passions.map((passion, i) => (
                <Passion key={i}>
                  <PassionName>{passion}</PassionName>
                  <DeletePassion
                    onClick={() => {
                      setPassions([
                        ...passions.slice(0, i),
                        ...passions.slice(i + 1),
                      ]);
                    }}>
                    X
                  </DeletePassion>
                </Passion>
              ))}
            </PassionsPreview>
          </Section>
        </>
      ) : (
        <div>
          {name}
          {age}
          {city}
          {JSON.stringify(photos)}
          {JSON.stringify(passions)}
        </div>
      )}
    </ModalMenu>
  );
};

export default EditProfile;
