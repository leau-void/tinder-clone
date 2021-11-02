import React, { useEffect, useState } from "react";
import "./App.css";
import { Switch, Route, useLocation, Redirect } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Auth from "./components/Auth";
import Main from "./components/Main";
import Settings from "./components/Settings";
import { firebaseConfig } from "./firebase-config";
import { UserProvider } from "./context/UserContext";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(getAuth().currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (newUser) => {
      setUser(newUser);
    });
    return () => unsub();
  }, []);

  return (
    <UserProvider value={user}>
      {!user && <Redirect push to="/login" />}
      <Switch key={location.pathname} location={location}>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/login">
          <Auth />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Switch>
    </UserProvider>
  );
}

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default App;
