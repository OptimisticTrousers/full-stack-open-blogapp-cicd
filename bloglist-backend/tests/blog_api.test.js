const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  const userPromises = [];
  const blogPromises = [];
  for (let i = 0; i < helper.initialBlogs.length; i++) {
    const blog = helper.initialBlogs[i];
    const user = helper.initialUsers[i];
    const newBlog = new Blog({ ...blog, user: user.id });
    blogPromises.push(newBlog.save());
    const newUser = new User({ ...user, blogs: [newBlog.id] });
    userPromises.push(newUser.save());
  }
  await Promise.all(blogPromises);
  await Promise.all(userPromises);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("that the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");

  const hasIds = response.body.filter((blog) => "id" in blog);
  assert.strictEqual(hasIds.length, helper.initialBlogs.length);
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "Taco Recipe",
    author: "Tony Isern",
    url: "http://taco.com",
    likes: 5,
  };
  const newUser = {
    username: "marselle",
    name: "Marselle",
    password: "password",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api
    .post("/api/login")
    .send({
      username: newUser.username,
      password: newUser.password,
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${response.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  assert(titles.includes("Taco Recipe"));
});

test("blog without likes is defaulted to 0", async () => {
  const newBlog = {
    title: "Programming Tutorial",
    author: "Tony Isern",
    url: "http://programming.com",
  };
  const newUser = {
    username: "marselle",
    name: "Marselle",
    password: "password",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api
    .post("/api/login")
    .send({
      username: newUser.username,
      password: newUser.password,
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${response.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const blog = blogsAtEnd.find((blog) => blog.likes === 0);
  assert(blog.title === "Programming Tutorial");
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Tony Isern",
    url: "http://taco.com",
    likes: 5,
  };
  const newUser = {
    username: "marselle",
    name: "Marselle",
    password: "password",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api
    .post("/api/login")
    .send({
      username: newUser.username,
      password: newUser.password,
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${response.body.token}`)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "Taco Recipe",
    author: "Tony Isern",
    likes: 5,
  };
  const newUser = {
    username: "marselle",
    name: "Marselle",
    password: "password",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api
    .post("/api/login")
    .send({
      username: newUser.username,
      password: newUser.password,
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${response.body.token}`)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("a blog cannot be deleted if a token is not provided", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  const titles = blogsAtEnd.map((b) => b.title);
  assert(titles.includes(blogToDelete.title));

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

// test("a blog can be deleted", async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   const blogToDelete = blogsAtStart[0];
//   const newUser = {
//     username: "marselle",
//     name: "Marselle",
//     password: "password",
//   };

//   await api
//     .post("/api/users")
//     .send(newUser)
//     .expect(201)
//     .expect("Content-Type", /application\/json/);
//   const response = await api
//     .post("/api/login")
//     .send({
//       username: newUser.username,
//       password: newUser.password,
//     })
//     .expect(200)
//     .expect("Content-Type", /application\/json/);
//   await api
//     .delete(`/api/blogs/${blogToDelete.id}`)
//     .set("Authorization", `Bearer ${response.body.token}`)
//     .expect(204);

//   const blogsAtEnd = await helper.blogsInDb();

//   const titles = blogsAtEnd.map((b) => b.title);
//   assert(!titles.includes(blogToDelete.title));

//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
// });

// test("a blog cannot be deleted if the user did created it", async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   const blogToDelete = blogsAtStart[0];
//   const newUser = {
//     username: "marselle",
//     name: "Marselle",
//     password: "password",
//   };

//   await api
//     .post("/api/users")
//     .send(newUser)
//     .expect(201)
//     .expect("Content-Type", /application\/json/);
//   const response = await api
//     .post("/api/login")
//     .send({
//       username: newUser.username,
//       password: newUser.password,
//     })
//     .expect(200)
//     .expect("Content-Type", /application\/json/);
//   await api
//     .delete(`/api/blogs/${blogToDelete.id}`)
//     .set("Authorization", `Bearer ${response.body.token}`)
//     .expect(400);

//   const blogsAtEnd = await helper.blogsInDb();

//   const titles = blogsAtEnd.map((b) => b.title);
//   assert(!titles.includes(blogToDelete.title));

//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
// });

// test("a blog can be updated", async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   const blogToUpdate = blogsAtStart[0];
//   const newBlog = {
//     title: "Updated title",
//     likes: 3,
//     url: "http://update.com",
//     author: "Bob Jones",
//   };

//   await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200);

//   const blogsAtEnd = await helper.blogsInDb();

//   const titles = blogsAtEnd.map((b) => b.title);
//   assert(titles.includes("Updated title"));
//   assert(!titles.includes(blogToUpdate.id));

//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
// });

// test("when updating, it fails with status code 404 if blog does not exist", async () => {
//   const validNonexistingId = await helper.nonExistingId();
//   const newBlog = {
//     title: "Updated title",
//     likes: 3,
//     url: "http://update.com",
//     author: "Bob Jones",
//   };

//   await api.put(`/api/blogs/${validNonexistingId}`).send(newBlog).expect(404);
// });

// test("when updating, it fails with statuscode 400 id is invalid", async () => {
//   const invalidId = "5a3d5da59070081a82a3445";
//   const newBlog = {
//     title: "Updated title",
//     likes: 3,
//     url: "http://update.com",
//     author: "Bob Jones",
//   };

//   await api.put(`/api/blogs/${invalidId}`).send(newBlog).expect(400);
// });

after(async () => {
  await mongoose.connection.close();
});
