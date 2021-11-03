import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Settings from "../components/Settings";
import { MemoryRouter } from "react-router-dom";
import { getAuth, signOut } from "@firebase/auth";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";

describe("logout button", () => {
  it("logout button is present", async () => {
    render(<Settings />, { wrapper: MemoryRouter });
    expect(await screen.findByRole("button", { name: "Logout" })).toBeVisible();
  });

  // it("logout button calls correct function", async () => {
  //   render(<Settings />, { wrapper: MemoryRouter });
  //   const logout = await screen.findByRole("button", { name: "Logout" });
  //   const spiedFN = jest.fn(signOut);
  //   logout.onclick = () => spiedFN("test" as any);

  //   fireEvent(logout, new MouseEvent("click"));
  //   expect(spiedFN).toHaveBeenCalled();
  // });
});
