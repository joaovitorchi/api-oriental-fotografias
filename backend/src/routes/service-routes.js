const router = require("express").Router();
const serviceController = require("../controller/service-controller");
const middlewareAuthorization = require("../middleware/auth-middleware");

/* GET */
router.get(
  "/id/:serviceId",
  [middlewareAuthorization("ADMIN")],
  serviceController.getServiceById
);

router.get(
  "/list",
  [middlewareAuthorization("ADMIN")],
  serviceController.listService
);

/* POST */
router.post(
  "/create",
  [
    middlewareAuthorization("ADMIN"),
    serviceController.validadeCreation()
  ],
  serviceController.createService
);

router.post(
  "/score",
  [
    middlewareAuthorization("ADMIN"),
  ],
  serviceController.insertScoreService
);

/* PUT */
router.put(
  "/update",
  [
    middlewareAuthorization("ADMIN"),
    serviceController.validadeUpdate()
  ],
  serviceController.updateService
);

module.exports = router;