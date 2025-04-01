const userController = require("../controller/user-controller");

const router = require("express").Router();

/* POST */
router.post(
  "/create",
  [userController.validateCreation()],
  userController.createUser
);

module.exports = router;