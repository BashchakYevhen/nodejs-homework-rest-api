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
module.exports = { currentUser };
