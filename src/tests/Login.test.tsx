import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../components/Login";
import { firebaseConfig } from "../firebase-config";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import firebase from "firebase/app";

describe("login page", () => {
  jest.spyOn(firebase, "app").mockImplementation(() => ({
    firestore: () => ({
      collection: () => ({
        get: () => fetchPromise,
      }),
    }),
  }));

  it("shows intro text", () => {
    render(<Login />);
    // expect(screen.getByRole("header", { level: 3 })).toHaveTextContent(
    //   "Get started"
    // );
    // expect(screen.getAllByAltText("Waves logo")).toBeVisible();
  });

  it("shows login buttons", () => {});

  it("phone login opens modal", () => {});

  it("opening modal focuses the input", () => {});

  it("login buttons call correct login func", () => {});
});
