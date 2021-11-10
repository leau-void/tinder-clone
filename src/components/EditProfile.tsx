import React, {
  SyntheticEvent,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import UserContext from "../context/UserContext";
import ModalMenu, {
  Section,
  SectionLabel,
  TopButtonLeft,
  TopButtonSave,
} from "./ModalMenu";
import PhotoCard from "./PhotoCard";
import validFileType from "../utils/validFileType";
import { doc, updateDoc } from "@firebase/firestore";
import { db, store } from "../App";
import CroppingTool from "./CroppingTool";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import uniqid from "uniqid";

const Tabs = styled.nav``;

const Tab = styled.button`
  &.active {
    color: blue;
  }
`;

const PhotoContainer = styled.div`
  display: grid;
  grid: repeat(3, 134px) / repeat(3, 100px);
  grid-gap: 20px;
`;

const Value = styled.div``;

const Input = styled.input``;

const TextArea = styled.textarea``;

const Form = styled.form``;

const Submit = styled.button``;

const PassionsPreview = styled.div``;

const Passion = styled.div``;

const PassionName = styled.div``;

const DeletePassion = styled.button``;

interface EditPhoto {
  src: string;
  path?: string;
  file?: File | Blob;
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
  const [editPhoto, setEditPhoto] = useState<null | File>(null);

  const isClickDown = useRef<boolean>(false);
  const clickDownTimer = useRef<number | null>(null);

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
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    if (!validFileType(file)) return;
    setEditPhoto(file);
    target.value = "";
  };

  const handleSavePhoto = (
    e: SyntheticEvent,
    { src, file }: { src: string; file: Blob }
  ) => {
    setEditPhoto(null);

    const newIndex = photos.findIndex((cur) => !cur);
    setPhotos([
      ...photos.slice(0, newIndex),
      {
        src,
        file,
      },
      ...photos.slice(newIndex + 1),
    ]);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setPassions([...passions, passionInput]);
    setPassionInput("");
  };

  const handleSave = async () => {
    if (!user) return;
    closeModal();

    const docRef = doc(db, "users", user.uid);
    const userPath = `users/${user.uid}`;
    const userRef = ref(store, userPath);

    const newPhotos = await Promise.all(
      photos
        .filter((photo) => photo != null)
        .map(async (photo) => {
          if (!photo!.file) return photo;
          const photoRef = ref(
            userRef,
            uniqid() + "." + photo!.file.type.split("/")[1]
          );
          const snap = await uploadBytes(photoRef, photo!.file);
          const src = await getDownloadURL(photoRef);

          return {
            path: snap.metadata.fullPath,
            src,
          };
        })
    );

    user.profile.photos
      .filter((photo) => !!photo.path && !newPhotos.includes(photo))
      .forEach((photo) => deleteObject(ref(store, photo.path!)));

    updateDoc(docRef, {
      profile: {
        name: name,
        age: Number(age) > 18 && Number(age) < 100 ? Number(age) : 25,
        description: description,
        city: city,
        gender: gender,
        orientation: orientation,
        passions: passions,
        photos: newPhotos,
      },
    });
  };

  useEffect(() => {
    const handleClickEnd = () => {
      isClickDown.current = false;
      if (clickDownTimer.current) clearTimeout(clickDownTimer.current);
      clickDownTimer.current = null;
    };

    window.addEventListener("mouseup", handleClickEnd);
    window.addEventListener("touchend", handleClickEnd);

    return () => {
      window.removeEventListener("mouseup", handleClickEnd);
      window.removeEventListener("touchend", handleClickEnd);
    };
  }, []);

  const handleMove = (e: SyntheticEvent) => {
    isClickDown.current = true;
    clickDownTimer.current = window.setTimeout(() => {
      if (isClickDown.current) console.log("yes!");
      // TODO : Add handler for reorganizing photos
    }, 1500);
  };

  return (
    <ModalMenu
      title="Edit info"
      doOpen={doOpen}
      buttons={{
        left: <TopButtonLeft onClick={() => closeModal()}>Back</TopButtonLeft>,
        right: <TopButtonSave onClick={() => handleSave()}>Save</TopButtonSave>,
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
      <CroppingTool {...{ editPhoto, setEditPhoto, handleSavePhoto }} />
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
                  handleMove={handleMove}
                />
              ))}
            </PhotoContainer>
          </Section>
          <Section>
            <SectionLabel>NAME</SectionLabel>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </Section>
          <Section>
            <SectionLabel>AGE</SectionLabel>
            <Input
              onChange={(e) => setAge(Number(e.target.value))}
              value={age}
              type="number"
            />
          </Section>
          <Section>
            <SectionLabel>ABOUT ME</SectionLabel>
            <TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </Section>
          <Section>
            <SectionLabel>LIVING IN</SectionLabel>
            <Input onChange={(e) => setCity(e.target.value)} value={city} />
          </Section>
          <Section>
            <SectionLabel>GENDER</SectionLabel>
            <Input onChange={(e) => setGender(e.target.value)} value={gender} />
          </Section>
          <Section>
            <SectionLabel>SEXUAL ORIENTATION</SectionLabel>
            <Input
              onChange={(e) => setOrientation(e.target.value)}
              value={orientation}
            />
          </Section>
          <Section>
            <SectionLabel>PASSIONS</SectionLabel>
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
