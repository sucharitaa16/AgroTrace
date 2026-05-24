const router = require("express").Router();

const auth = require("../middleware/auth.middleware");

const {
  createBatch,
  updateProduct,
  sellProduct,
  getHistory,
  getMyProducts
} = require("../controllers/product.controller");

router.post(
  "/create",
  auth,
  createBatch
);

router.put(
  "/update/:productId",
  auth,
  updateProduct
);

router.post(
  "/sell/:productId",
  auth,
  sellProduct
);

router.get(
  "/history/:productId",
  getHistory
);

router.get(
  "/my-products",
  auth,
  getMyProducts
);

module.exports = router;