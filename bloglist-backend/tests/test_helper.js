const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "How to Make a Cake",
    author: "Tony Isern",
    url: "http://cake.com/how",
    likes: 2,
  },
  {
    title: "How to Make a Cake Part 2",
    author: "Tony Isern",
    url: "http://cake.com/how",
    likes: 2,
  },
];

const initialUsers = [
  {
    username: "Joe",
    name: "Joe Shmoe",
    passwordHash: "eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW",
  },
  {
    username: "Fred",
    name: "Fred Snyder",
    passwordHash: "eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    url: "http://willremovethissoon.com",
    likes: 0,
    author: "Will Remove This Soon",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
