const router = require("express").Router();
const indexController = require("../controller/index-controller");

/* GET */
router.get("/info", indexController.info);

module.exports = router;