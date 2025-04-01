const router = require("express").Router();
const loginController = require("../controller/login-controller");

/* POST */
router.post(
  "/login", 
  [loginController.validate()],
  loginController.login
);

router.post(
  "/password/restore",
  [loginController.validateChangePassword()],
  loginController.changePassword
);

// router.post(
//   "/password/lost",
//   [loginController.validateLostPassword()],
//   loginController.lostPassword
// );

module.exports = router;