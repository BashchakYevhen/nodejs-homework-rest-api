const express = require("express");
const router = express.Router();
const {
  currentUser,
  updateAvatar,
} = require("../../controllers/users.controllers");
const { authVerify } = require("../../middlewares/authVerify");
const { upload } = require("../../middlewares/upload");
const { tryCatch } = require("../../TryCatchWrapper/TryCatchWrapper");

router.get("/current", tryCatch(authVerify), tryCatch(currentUser));
router.patch(
  "/avatars",
  tryCatch(authVerify),
  upload.single("file"),
  tryCatch(updateAvatar)
);
module.exports = router;
