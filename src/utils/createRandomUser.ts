import { User } from "../types";
import { address, name, lorem, random, datatype, image } from "faker";

const orientations = [
  "Straight",
  "Gay",
  "Lesbian",
  "Bisexual",
  "Queer",
  "Questionning",
];

type PhotoTypes =
  | "image"
  | "cats"
  | "nature"
  | "people"
  | "nightlife"
  | "sports"
  | "animals"
  | "abstract";

const imageTypes: PhotoTypes[] = [
  "image",
  "cats",
  "nature",
  "people",
  "nightlife",
  "sports",
  "animals",
  "abstract",
];

const createRandomUser = ({
  isHuman,
}: {
  isHuman?: boolean;
} = {}): User => {
  if (!isHuman) isHuman = false;
  const getPhotos = () =>
    new Array(Math.round(Math.random() * 2 + 3)).fill(null).map(() => {
      const type = imageTypes[Math.round(Math.random() * 7)];

      return {
        src: image.imageUrl(350, 467, type),
      };
    });

  const profile = {
    gender: name.gender(),
    name: name.findName(),
    age: Math.round(Math.random() * 50 + 21),
    description: lorem.sentence() + " " + lorem.sentence(),
    city: address.cityName(),
    job: name.jobTitle(),
    orientation: orientations[Math.round(Math.random() * 5)],
    passions: new Array(Math.round(Math.random() * 3 + 3))
      .fill(null)
      .map(() => random.word()),
    photos: getPhotos(),
  };

  return {
    isHuman,
    profile,
    uid: datatype.uuid(),
    likes: [] as string[],
    dislikes: [] as string[],
    settings: {
      distance: 100,
      minAge: 18,
      maxAge: 100,
      global: true,
    },
    location: {
      lat: Number(address.latitude()),
      lon: Number(address.longitude()),
      timestamp: 0,
    },
  };
};

export default createRandomUser;
