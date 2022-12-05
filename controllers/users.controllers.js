const Jimp = require("jimp");
const shortid = require("shortid");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../models/user.model");

async function currentUser(req, res, next) {
  console.log("logout");
  const { authorization } = req.headers;
  const user = await User.findOne({ authorization });
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(200).json({
    data: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

async function updateAvatar(req, res, next) {
  const { file } = req;
  const { authorization } = req.headers;

  Jimp.read(file.path, (err, image) => {
    if (err) {
      throw err;
    }
    image.resize(250, 250).write(file.path);
  });

  const user = await User.findOne({ authorization });
  const newPath = path.join(
    __dirname,
    "../public/avatars",
    shortid() + user.email + file.filename
  );
  user.avatarURL = newPath;
  await User.findByIdAndUpdate(user.id, user);
  await fs.rename(file.path, newPath);
  res.status(200).json({
    data: {
      avatarURL: `${newPath}`,
    },
  });
}
module.exports = { currentUser, updateAvatar };
