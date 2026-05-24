const mongoose = require("mongoose");

const transferRequestSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    otp: String,

    verified: {
      type: Boolean,
      default: false,
    },

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TransferRequest",
  transferRequestSchema
);