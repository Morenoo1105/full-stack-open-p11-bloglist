const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.likes) body.likes = 0;

  if (!body.title || !body.url) return response.status(400).end();

  const user = request.user;

  if (!user)
    return response.status(401).json({ error: "token missing or invalid" });

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save({ validateModifiedOnly: true });

  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) return response.status(404).end();

  const user = request.user;

  if (!user)
    return response.status(401).json({ error: "token missing or invalid" });

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "user not authorized" });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
    },
    {
      new: true,
    }
  );

  response.json(updatedBlog.toJSON());
});

module.exports = blogsRouter;
