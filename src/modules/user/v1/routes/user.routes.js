const express = require("express");

const AuthController = require("../../../auth/v1/controllers/auth.controller");
const authController = new AuthController();

const UserController = require("../controllers/user.controller");
const userController = new UserController();

const router = express.Router();

router.route("/").get(authController.protect, userController.getUserList);

router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.patchUser)
  .delete(
    authController.protect,
    authController.restrict("admin"),
    userController.deleteUser
  );

module.exports = router;
