const config = require("./utils/config");

const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(middleware.requestLogger);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

morgan.token("content", (request) =>
  request.method === "POST" && request.body.name
    ? JSON.stringify(request.body)
    : null
);

app.use(middleware.tokenExtractor);

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
