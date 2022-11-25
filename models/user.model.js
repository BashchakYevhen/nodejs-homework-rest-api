const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { BadRequest } = require("http-errors");
const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
    minLength: 6,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) next();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    if (error) {
      throw new BadRequest("BadRequest");
    }
  }
});

const User = model("user", userSchema);

module.exports = { User };
