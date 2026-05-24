const router = require("express").Router();

const auth = require("../middleware/auth.middleware");

const {
  getAnalytics,
} = require("../controllers/analytics.controller");

router.get(
  "/dashboard",
  auth,
  getAnalytics
);

module.exports = router;