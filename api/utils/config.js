require("dotenv").config();

const PORT = process.env.NODE_ENV === "test" ? 8000 : process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
};
