const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password, subscription = "starter" } = req.body;
  const user = new User({ email, password, subscription });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    if (error.message.includes("duplicate key error collection")) {
      throw new Conflict("message: Email in use");
      // return res.status(409).json({ message: "Email in use" });
    }
    throw error;
  }
  return res.status(201).json({
    data: { User: { email: user.email, subscription: user.subscription } },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
    // throw new Unauthorized("Email or password is wrong");
  }
  const isPasswordTheSame = await bcrypt.compare(password, user.password);

  if (!isPasswordTheSame) {
    // return res.status(401).json({ message: "Email or password is wrong" });
    throw new Unauthorized("Email or password is wrong");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "5m" });
  user.token = token;
  await User.findByIdAndUpdate(user._id, user);

  return res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

async function logout(req, res, next) {
  console.log("logout");
  const { authorization } = req.headers;
  const user = await User.findOne({ authorization });
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(204).json({ message: "No Content" });
}
module.exports = { login, register, logout };
