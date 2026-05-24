const mongoose = require("mongoose");

const blockchainLedgerSchema =
  new mongoose.Schema(
    {
      productId: {
        type: String,
        required: true,
        index: true,
      },

      blockNumber: {
        type: Number,
        required: true,
      },

      previousHash: {
        type: String,
        required: true,
      },

      currentHash: {
        type: String,
        required: true,
        unique: true,
      },

      transactionType: {
        type: String,
        enum: [
          "CREATE_BATCH",
          "MANUFACTURER",
          "DISTRIBUTOR",
          "RETAILER",
          "SOLD",
        ],
      },

      performedBy: {
        userId: String,
        role: String,
      },

      data: {
        type: Object,
        required: true,
      },
      productHash: {
  type: String,
  required: true,
},

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "BlockchainLedger",
  blockchainLedgerSchema
);