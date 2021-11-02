import React from "react";
import { Link } from "react-router-dom";
import { signOut, getAuth } from "@firebase/auth";

const Settings = () => {
  return (
    <div>
      Settings
      <Link to="/">Back to main</Link>
      <button onClick={() => signOut(getAuth())}>Logout</button>
    </div>
  );
};

export default Settings;
