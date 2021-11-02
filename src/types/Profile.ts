export default interface Photo {
  src: string;
  alt: string;
}
export default interface Profile {
  name: string;
  age: number;
  description: string;
  photos: Photo[];
}
