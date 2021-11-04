import React, { useEffect, useState } from "react";
import "./App.css";
import { Switch, Route, useLocation, Redirect } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Login from "./components/Login";
import Main from "./components/Main";
import Settings from "./components/Settings";
import Header from "./components/Header";
import { firebaseConfig } from "./firebase-config";
import { UserProvider } from "./context/UserContext";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { User } from "./types";
import createRandomUser from "./utils/createRandomUser";
import createEmptyUser from "./utils/createEmptyUser";

declare global {
  interface Window {
    addUsers: (n: number) => void;
  }
}

window.addUsers = (n) => {
  for (let i = 0; i < n; i++) {
    const newUser = createRandomUser();
    const docRef = doc(db, "users", newUser.uid);
    setDoc(docRef, newUser);
  }
};

function App() {
  const location = useLocation();
  const [userID, setUserID] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (newUser) => {
      if (newUser) {
        setUserID(newUser.uid);
      } else {
        setUserID(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let unsub: () => void;

    if (userID) {
      const docRef = doc(db, "users", userID);
      unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) setUser(snap.data() as User);
        else {
          let newObj = getAuth().currentUser?.isAnonymous
            ? { ...createRandomUser(), uid: userID, isHuman: true }
            : { ...createEmptyUser(), uid: userID };
          setDoc(docRef, newObj, { merge: true });
        }
      });
    } else {
      setUser(null);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [userID]);

  useEffect(() => {
    console.log(user, getAuth().currentUser);
  });

  return (
    <UserProvider value={user}>
      {!user && <Redirect push to="/login" />}
      <Header />
      <Switch key={location.pathname} location={location}>
        <Route path="/login">
          <Login />
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
