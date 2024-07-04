const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 10);
  const user = new User({
    username: "superuser",
    name: "Superuser",
    blogs: [],
    passwordHash,
  });

  await user.save();
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const users = await User.find({});
  const user = users[0];
  const id = user._id;

  let blogObject = new Blog({ ...helper.initialBlogs[0], user: id });
  await blogObject.save();
  user.blogs = user.blogs.concat(blogObject._id);

  blogObject = new Blog({ ...helper.initialBlogs[1], user: id });
  await blogObject.save();
  user.blogs = user.blogs.concat(blogObject._id);

  await user.save();
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("ID written as so and not _id", async () => {
    const response = await api.get("/api/blogs");

    assert(Object.keys(response.body[0]).includes("id"));
    assert(!Object.keys(response.body[0]).includes("_id"));
  });
});

describe("addition of a new blog", () => {
  let headers;

  beforeEach(async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "superuser", password: "password" });

    headers = {
      Authorization: `Bearer ${response.body.token}`,
    };
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    assert(titles.includes("Canonical string reduction"));
  });

  test("adding blog without jwt token", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });

  test("if LIKES property is missing, it will default to 0", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find(
      (blog) => blog.title === "Canonical string reduction"
    );
    assert.strictEqual(addedBlog.likes, 0);
  });

  test("if TITLE property is missing, return 400", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api.post("/api/blogs").send(newBlog).set(headers).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test("if URL property is missing, return 400", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      title: "Canonical string reduction",
      likes: 12,
    };

    await api.post("/api/blogs").send(newBlog).set(headers).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  let headers;

  beforeEach(async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "superuser", password: "password" });

    headers = {
      Authorization: `Bearer ${response.body.token}`,
    };
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204).set(headers);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    assert(!titles.includes(blogToDelete.title));
  });

  test("a blog CANNOT be deleted without jwt", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe("updating a blog", () => {
  let headers;

  beforeEach(async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "superuser", password: "password" });

    headers = {
      Authorization: `Bearer ${response.body.token}`,
    };
  });

  test("blog likes can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .set(headers);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogAtEnd = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );

    assert.strictEqual(updatedBlogAtEnd.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
