const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const helper = require("./test_helper");

const User = require("../models/user");

describe("when there are some users saved initially", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get("/api/users");

    assert.strictEqual(response.body.length, helper.initialUsers.length);
  });

  describe("addition of a new user", () => {
    test("succeeds with valid data", async () => {
      const newUser = {
        username: "bobjones",
        name: "Bob Jones",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes("bobjones"));
    });

    test("fails with status code 400 if username is less than 3 characters", async () => {
      const newUser = {
        username: "bo",
        name: "Bob Jones",
        password: "password",
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      const usernames = usersAtEnd.map((u) => u.username);
      assert.strictEqual(
        response.body.error,
        "User validation failed: username: Path `username` (`bo`) is shorter than the minimum allowed length (3)."
      );
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      assert(!usernames.includes("bo"));
    });

    test("fails with status code 400 if username is not unique", async () => {
      const newUser = {
        username: "bobjones",
        name: "Bob Jones",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      const usernames = usersAtEnd.map((u) => u.username);
      assert.strictEqual(
        response.body.error,
        "expected `username` to be unique"
      );
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1);
      assert(usernames.includes("bobjones"));
    });

    test("fails with status code 400 if password is less than 3 characters", async () => {
      const newUser = {
        username: "bobjones",
        name: "Bob Jones",
        password: "pa",
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      const usernames = usersAtEnd.map((u) => u.username);
      assert.strictEqual(
        response.body.error,
        "password must be at least 3 characters long"
      );
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      assert(!usernames.includes("bobjones"));
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
