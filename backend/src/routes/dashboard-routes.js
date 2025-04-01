const router = require("express").Router();
const dashboardController = require("../controller/dashboard-controller");
const middlewareAuthorization = require("../middleware/auth-middleware");

/* GET */
router.get(
  "/total-values",
  [middlewareAuthorization("ADMIN")],
  dashboardController.getMenuNumbers
);

module.exports = router;