const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/auth.routes")
);

app.use(
  "/api/products",
  require("./routes/product.routes")
);

app.use(
  "/api/transfer",
  require("./routes/transfer.routes")
);

app.use(
  "/api/analytics",
  require("./routes/analytics.routes")
);

app.use(
  "/api/verify",
  require("./routes/blockchain.routes")
);

module.exports = app;