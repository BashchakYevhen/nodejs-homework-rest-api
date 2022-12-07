const sgMail = require("@sendgrid/mail");
const { User } = require("../models/user.model");
require("dotenv").config();
const { SENDGRID_API_KEY, EMAIL } = process.env;

async function sendVerification(req, res, next) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: EMAIL,
    from: EMAIL,
    subject: "Registration",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>Registration is confirmed</strong>",
  };
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const sendEmail = await sgMail.send(msg);
  user.verificationToken = null;
  user.verify = true;
  await User.findByIdAndUpdate(user._id, user);
  console.log("Email sent", sendEmail);
  res.status(200).json({ message: "Verification successful" });
}

async function reSendVerification(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  if (!user) {
    return res.status(404).json({ message: "email not found" });
  }
  if (user.verify === true) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: EMAIL,
    from: EMAIL,
    subject: "Confirm registration",
    text: "and easy to do anywhere, even with Node.js",
    html: `<p>Follow to link -</p><a>localhost:3000/api/users/verify/${user.verificationToken}</a>`,
  };
  await sgMail.send(msg);
  res.status(200).json({ message: "Verification email sent" });
}

module.exports = { sendVerification, reSendVerification };
