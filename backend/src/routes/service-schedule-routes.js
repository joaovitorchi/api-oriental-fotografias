const router = require("express").Router();
const serviceScheduleController = require("../controller/service-schedule-controller");
const middlewareAuthorization = require("../middleware/auth-middleware");

/* GET */
router.get(
  "/list-my-schedules",
  [middlewareAuthorization("ADMIN")],
  serviceScheduleController.listSchedulesByUserId
);

/* POST */
router.post(
  "/create",
  [middlewareAuthorization("ADMIN")],
  serviceScheduleController.createSchedule
);

/* PUT */
router.put(
  "/approve-disapprove/:scheduleId/:approved",
  [middlewareAuthorization("ADMIN")],
  serviceScheduleController.approveDisapproveSchedule
);

module.exports = router;