const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const sgMail = require("@sendgrid/mail");
const { User } = require("../models/user.model");
require("dotenv").config();
const { JWT_SECRET, SENDGRID_API_KEY, EMAIL } = process.env;

async function register(req, res, next) {
  const { email, password, subscription = "starter" } = req.body;
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const user = new User({
    email,
    password,
    subscription,
    avatarURL,
    verificationToken,
  });

  try {
    await user.save();
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: EMAIL,
      from: EMAIL,
      subject: "Confirm registration",
      text: "and easy to do anywhere, even with Node.js",
      html: `<p>Follow to link -</p><a>localhost:3000/api/users/verify/${verificationToken}</a>`,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
    if (error.message.includes("duplicate key error collection")) {
      throw new Conflict("message: Email in use");
      // return res.status(409).json({ message: "Email in use" });
    }
    throw error;
  }
  return res.status(201).json({
    data: {
      User: { email: user.email, subscription: user.subscription, avatarURL },
    },
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
  if (user.verify === false) {
    return res.status(400).json({ message: "Email is not confirmed" });
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "30m" });
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
