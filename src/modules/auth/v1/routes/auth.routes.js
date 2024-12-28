const express = require("express");

const AuthController = require("../controllers/auth.controller");
const authController = new AuthController();

const router = express.Router();

router.route("/sign-up").post(authController.signUp);
router.route("/sign-in").post(authController.signIn);

module.exports = router;
