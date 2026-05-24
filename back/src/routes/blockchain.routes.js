const express = require("express");

const router = express.Router();

const {
  verifyChain,
} = require(
  "../controllers/blockchain.controller"
);

router.get(
  "/:productId",
  verifyChain
);

module.exports = router;