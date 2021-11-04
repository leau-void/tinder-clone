export interface Photo {
  src: string;
  alt: string;
}

export interface Profile {
  name: string;
  age: number;
  description: string;
  photos: Photo[];
  city: string;
  gender: string;
  sexual_orientation: string;
  passions: string[];
}
