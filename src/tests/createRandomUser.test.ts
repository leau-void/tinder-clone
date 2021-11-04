import createRandomUser from "../utils/createRandomUser";
import { User } from "../types";

describe("random user generation", () => {
  const newUser: User = createRandomUser();

  it("generates a User Object", () => {
    expect(newUser).toHaveProperty("uid");
    expect(newUser).toHaveProperty("likes");
    expect(newUser.likes).toBeInstanceOf(Array);
    expect(newUser).toHaveProperty("dislikes");
    expect(newUser.dislikes).toBeInstanceOf(Array);
    expect(newUser).toHaveProperty("location.lat");
    expect(newUser).toHaveProperty("location.lon");
    expect(newUser).toHaveProperty("isHuman", false);
    expect(newUser).toHaveProperty("settings");
    expect(newUser).toHaveProperty("settings.distance", 0);
  });

  it("user has profile", () => {
    const profile = newUser.profile;
    expect(profile).toHaveProperty("name");
    expect(profile).toHaveProperty("age");
    expect(profile).toHaveProperty("description");
    expect(profile).toHaveProperty("photos");
    expect(profile.photos[0]).toBeTruthy();
    expect(profile).toHaveProperty("city");
    expect(profile).toHaveProperty("gender");
    expect(profile).toHaveProperty("sexual_orientation");
    expect(profile).toHaveProperty("passions");
    expect(profile.passions[0]).toBeTruthy();
    expect(profile.passions[1]).toBeTruthy();
    expect(profile.passions[2]).toBeTruthy();
  });

  it("users are different", () => {
    const newUser2: User = createRandomUser();
    expect(newUser2).not.toMatchObject(newUser);

    const newUser3: User = createRandomUser({ isHuman: true });
    expect(newUser3).toHaveProperty("isHuman", true);
    expect(newUser3).not.toMatchObject(newUser2);
    expect(newUser3.profile.passions[0]).not.toMatch(
      newUser2.profile.passions[0]
    );
  });
});
