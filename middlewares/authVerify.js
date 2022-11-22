const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET } = process.env;
const { User } = require("../models/user.model");
const { Unauthorized } = require("http-errors");

async function authVerify(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [tokenType, token] = authHeader.split(" ");
  if (tokenType === "Bearer" && token) {
    try {
      const verifiedToken = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(verifiedToken._id);
      if (!user) {
        next(new Unauthorized("Not authorized"));
      }
      if (!user.token) {
        next(new Unauthorized("Not authorized"));
      }
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        next(new Unauthorized(error.name));
      }
      if (error.name === "JsonWebTokenError") {
        next(new Unauthorized(error.name));
      }
      throw error;
    }
  }
  return next(new Unauthorized("Not authorized"));
}
module.exports = { authVerify };