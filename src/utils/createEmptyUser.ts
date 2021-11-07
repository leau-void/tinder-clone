import { User, Photo } from "../types";

const createEmptyUser = (): User => {
  const profile = {
    name: "",
    age: 21,
    description: "",
    photos: [] as Photo[],
    city: "",
    gender: "",
    orientation: "",
    passions: [] as string[],
  };

  const settings = {
    distance: 100,
    minAge: 18,
    maxAge: 100,
    global: true,
  };

  const location = {
    lat: 0,
    lon: 0,
  };

  return {
    profile,
    settings,
    location,
    uid: "",
    isHuman: true,
    likes: [] as string[],
    dislikes: [] as string[],
  };
};

export default createEmptyUser;
