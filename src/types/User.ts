export interface Location {
  lat: number;
  lon: number;
  timestamp: number;
}

export default interface User {
  uid: string;
  likes: string[];
  dislikes: string[];
  location: Location;
  profile: Profile;
  settings: Settings;
  isHuman: boolean;
}

export interface Photo {
  src: string;
  path?: string;
}

export interface Profile {
  name: string;
  age: number;
  description: string;
  photos: Photo[];
  city: string;
  job: string;
  gender: string;
  orientation: string;
  passions: string[];
  [key: string]: string | number | Photo[] | string[];
}

export interface Settings {
  distance: number;
  minAge: number;
  maxAge: number;
  global: boolean;
}
