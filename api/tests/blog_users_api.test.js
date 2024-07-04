const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const User = require("../models/user");

describe("adding users test", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const pwHash = await bcrypt.hash("password", 10);

    const userObject = new User({ username: "initial", passwordHash: pwHash });

    await userObject.save();
  });

  test("create a new user", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "super",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes("root"));
  });

  test("create a new user with less than three characters username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "super",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      result.body.error,
      "username must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("create a new user with less than three characters password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "su",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      result.body.error,
      "password must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("create a new user with no username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "",
      name: "Superuser",
      password: "super",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.error, "username and password required");

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("create a new user with no password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.error, "username and password required");

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
