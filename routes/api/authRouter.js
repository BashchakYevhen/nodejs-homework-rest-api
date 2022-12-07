const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controllers");
const {
  sendVerification,
  reSendVerification,
} = require("../../controllers/authVerification.controller");
const { authVerify } = require("../../middlewares/authVerify");
const { tryCatch } = require("../../TryCatchWrapper/TryCatchWrapper");

router.post("/register", tryCatch(authController.register));
router.post("/login", tryCatch(authController.login));
router.post("/logout", tryCatch(authVerify), tryCatch(authController.logout));
router.get("/verify/:verificationToken", tryCatch(sendVerification));
router.post("/verify", tryCatch(reSendVerification));
module.exports = router;
