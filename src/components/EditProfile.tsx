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
  TopButtonBack,
  TopButtonDone,
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
import ProfileCard from "./ProfileCard";

const Scrollable = styled.div`
  overflow-y: scroll;
  width: 100%;
`;

const Tabs = styled.nav`
  height: 6vh;
`;

const Tab = styled.button`
  &.active {
    color: blue;
  }
`;

const PhotoContainer = styled.div`
  display: grid;
  grid: repeat(3, 134px) / repeat(3, 100px);
  grid-gap: 20px;
  padding: 1rem;

  @media (max-width: 400px) {
    transform-origin: center center;
    transform: scale(0.8);
  }
`;

const Input = styled.input`
  width: 100%;
  border: 0;
  border-left: 3px solid transparent;
  padding: 0.75rem;
  padding-right: 4rem;

  &:focus {
    border-color: #424242;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 0;
  border-left: 3px solid transparent;
  padding: 0.75rem;
  resize: none;

  &:focus {
    border-color: #424242;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  margin: 0.5rem 0;
  border-bottom: 1px solid lightgrey;
  border-top: 1px solid lightgrey;
  position: relative;
`;

const Submit = styled.button`
  color: red;
  border: 0;
  background: 0;
  color: #3d84a8;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-25%, -50%);
  border-radius: 20px;
  padding: 0.5rem;

  &:disabled {
    color: lightgrey;
  }
`;

const PassionsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
`;

const Passion = styled.div`
  padding: 0.25rem 0.5rem;
  border: 1px solid;
  border-color: inherit;
  margin: 0.2rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PassionName = styled.div``;

const DeletePassion = styled.button`
  color: inherit;
  margin-left: 0.25rem;
  border: 0;
  background: 0;
`;

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
  const [job, setJob] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [passionInput, setPassionInput] = useState("");
  const [passions, setPassions] = useState<string[]>([]);
  const [editPhoto, setEditPhoto] = useState<null | File>(null);

  const isClickDown = useRef<boolean>(false);
  const clickDownTimer = useRef<number | null>(null);

  const [photos, setPhotos] = useState<Array<null | EditPhoto>>([]);

  const [currentTab, setCurrentTab] = useState<"edit" | "preview">("edit");

  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    setName(user.profile.name);
    setAge(user.profile.age);
    setDescription(user.profile.description);
    setCity(user.profile.city);
    setJob(user.profile.job);
    setGender(user.profile.gender);
    setOrientation(user.profile.orientation);
    setPassions(user.profile.passions);

    setPhotos(() =>
      new Array(9)
        .fill(null)
        .map((cur, i) =>
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
        job: job,
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
        left: <TopButtonBack onClick={() => closeModal()} />,
        right: <TopButtonDone onClick={() => handleSave()} />,
      }}
      animation="vertical">
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
        <Scrollable>
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

          <SectionLabel className="section-label">NAME</SectionLabel>
          <Section>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </Section>

          <SectionLabel className="section-label">AGE</SectionLabel>
          <Section>
            <Input
              onChange={(e) => setAge(Number(e.target.value))}
              value={age}
              type="number"
            />
          </Section>

          <SectionLabel className="section-label">ABOUT ME</SectionLabel>
          <Section>
            <TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={4}
            />
          </Section>

          <SectionLabel className="section-label">LIVING IN</SectionLabel>
          <Section>
            <Input onChange={(e) => setCity(e.target.value)} value={city} />
          </Section>

          <SectionLabel className="section-label">JOB TITLE</SectionLabel>
          <Section>
            <Input onChange={(e) => setJob(e.target.value)} value={job} />
          </Section>

          <SectionLabel className="section-label">GENDER</SectionLabel>
          <Section>
            <Input onChange={(e) => setGender(e.target.value)} value={gender} />
          </Section>

          <SectionLabel className="section-label">
            SEXUAL ORIENTATION
          </SectionLabel>
          <Section>
            <Input
              onChange={(e) => setOrientation(e.target.value)}
              value={orientation}
            />
          </Section>

          <SectionLabel className="section-label">PASSIONS</SectionLabel>
          <Section>
            <small style={{ paddingTop: "0.5rem" }}>
              Share up to 5 passions
            </small>
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
                    x
                  </DeletePassion>
                </Passion>
              ))}
            </PassionsPreview>
          </Section>
        </Scrollable>
      ) : user ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}>
          <ProfileCard user={user} />
        </div>
      ) : (
        <div>No profile to display.</div>
      )}
    </ModalMenu>
  );
};

export default EditProfile;
