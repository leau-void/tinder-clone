import { getAuth, signOut } from "@firebase/auth";
import React, { useState } from "react";
import Header from "./Header";

const Main = () => {
  const [page, setPage] = useState<"profile" | "feed" | "chat">("feed");
  return (
    <div>
      <Header />
      Main
      <button onClick={() => signOut(getAuth())}>Logout</button>
    </div>
  );
};

export default Main;
