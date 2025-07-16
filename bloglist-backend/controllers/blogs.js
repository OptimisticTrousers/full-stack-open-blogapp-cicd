const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const { content } = request.body;
  const blog = await Blog.findById(request.params.id);
  blog.comments.push(content);
  await blog.save();

  response.json({ blog });
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = await User.findById(request.user.id).populate("blogs");

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
    user: user.id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(blog._id);
  await user.save();
  await blog.populate("user");

  response.status(201).json(result);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (request.user.id.toString() !== blog.user.toString()) {
      return response
        .status(401)
        .json({ error: "only the user that created this blog can delete it" });
    }
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  const { title, url, likes, author, user } = request.body;

  blog.title = title;
  blog.url = url;
  blog.likes = likes;
  blog.author = author;
  blog.user = user;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
