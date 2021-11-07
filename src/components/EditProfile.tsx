import React, {
  SyntheticEvent,
  useContext,
  useState,
  useEffect,
  FormEvent,
} from "react";
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

const Form = styled.form``;

const Submit = styled.button``;

const Container = styled.div``;

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

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (passions.length >= 5) {
      console.log("aaa");
      return;
    }

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
            />
            <Submit type="submit">Add</Submit>
          </Form>
          <Container>
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
          </Container>
        </Section>
      </>
    </ModalMenu>
  );
};

export default EditProfile;
