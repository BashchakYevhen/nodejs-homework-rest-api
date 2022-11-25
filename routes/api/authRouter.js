const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controllers");
const { currentUser } = require("../../controllers/users.controllers");
const { authVerify } = require("../../middlewares/authVerify");
const { tryCatch } = require("../../TryCatchWrapper/TryCatchWrapper");

router.post("/register", tryCatch(authController.register));
router.post("/login", tryCatch(authController.login));
router.post("/logout", tryCatch(authVerify), tryCatch(authController.logout));
router.get("/current", tryCatch(authVerify), tryCatch(currentUser));

module.exports = router;
