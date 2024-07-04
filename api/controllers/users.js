const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({})
    .select({ username: 1, id: 1, name: 1 })
    .populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
    });

  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.username || !body.password) {
    return response
      .status(400)
      .json({ error: "username and password required" });
  }

  if (body.username.length < 3) {
    return response.status(400).json({
      error: "username must be at least 3 characters long",
    });
  }

  if (body.password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }

  try {
    const saltRounds = 10;
    const pwHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: pwHash,
    });

    const savedUser = await user.save();
    return response.status(201).json(savedUser);
  } catch (error) {
    return next(error);
  }
});

usersRouter.delete("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);

  if (!user) return response.status(404).end();

  await User.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

usersRouter.put("/:id", async (request, response) => {
  const user = request.body;

  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
    new: true,
  });

  response.json(updatedUser);
});

module.exports = usersRouter;
