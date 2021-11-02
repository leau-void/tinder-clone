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
import { doc, getDoc, DocumentData, setDoc } from "@firebase/firestore";
import { User } from "./types";

function App() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (newUser) => {
      if (newUser) {
        const docRef = doc(db, "users", newUser.uid);
        getDoc(docRef).then((snap) => {
          setUser(snap ? (snap.data() as User) : null);
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <UserProvider value={user}>
      {!user && <Redirect push to="/login" />}
      <Switch key={location.pathname} location={location}>
        <Route path="/login">
          <Auth />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </UserProvider>
  );
}

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default App;
