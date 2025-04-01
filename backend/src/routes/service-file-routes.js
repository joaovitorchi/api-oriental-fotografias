const router = require("express").Router();
const serviceFileController = require("../controller/service-file-controller");
const middlewareAuthorization = require("../middleware/auth-middleware");
const middlewareMulter = require("../middleware/multer-middleware");

/* POST */
router.post(
  "/upload/:serviceId",
  [
    middlewareAuthorization("ADMIN"),
    middlewareMulter("files", 5)
  ],
  serviceFileController.sendImage
);

module.exports = router;
