const router = require("express").Router();

const auth = require("../middleware/auth.middleware");

const {
  requestTransfer,
  verifyTransfer,
} = require("../controllers/transfer.controller");

router.post(
  "/request/:productId",
  auth,
  requestTransfer
);

router.post(
  "/verify/:requestId",
  auth,
  verifyTransfer
);

module.exports = router;