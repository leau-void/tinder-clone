import { Profile } from "./Profile";
import Settings from "./Settings";

interface Location {
  lat: number;
  lon: number;
}

export default interface User {
  uid: string;
  likes: string[];
  dislikes: string[];
  location: Location | null;
  profile: Profile;
  settings: Settings;
  isHuman: boolean;
}
