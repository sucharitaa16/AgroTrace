const BlockchainLedger = require(
  "../models/BlockchainLedger"
);

const Product = require(
  "../models/Product"
);

const {
  generateHash,
} = require(
  "../utils/hashGenerator"
);

const {
  generateProductHash,
} = require(
  "../utils/productHash"
);

exports.verifyBlockchain =
  async (productId) => {
    // get blockchain chain
    const chain =
      await BlockchainLedger.find({
        productId,
      }).sort({ blockNumber: 1 });

    // no blockchain records
    if (!chain.length) {
      return {
        valid: false,
        message:
          "No blockchain records found",
      };
    }

    // verify blockchain chain
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];

      // recreate hash
      const recalculatedHash =
        generateHash({
          productId:
            block.productId,

          blockNumber:
            block.blockNumber,

          previousHash:
            block.previousHash,

          transactionType:
            block.transactionType,

          performedBy:
            block.performedBy,

          data: block.data,

          productHash:
            block.productHash,

          timestamp:
            block.timestamp,
        });

      // verify current hash
      if (
        recalculatedHash !==
        block.currentHash
      ) {
        return {
          valid: false,
          message:
            "Block tampering detected",

          blockNumber:
            block.blockNumber,
        };
      }

      // verify chain linkage
      if (i > 0) {
        if (
          chain[i - 1].currentHash !==
          block.previousHash
        ) {
          return {
            valid: false,
            message:
              "Blockchain chain broken",
          };
        }
      }
    }

    // latest block
    const latestBlock =
      chain[chain.length - 1];

    // current product
    const product =
      await Product.findOne({
        productId,
      });

    if (!product) {
      return {
        valid: false,
        message:
          "Product not found",
      };
    }

    // recreate product hash
    const recalculatedProductHash =
      generateProductHash(product);

    // verify product integrity
    if (
      recalculatedProductHash !==
      product.integrityHash
    ) {
      return {
        valid: false,
        message:
          "Product collection data tampered",
      };
    }

    // verify against blockchain
    if (
      recalculatedProductHash !==
      latestBlock.productHash
    ) {
      return {
        valid: false,
        message:
          "Product does not match blockchain ledger",
      };
    }

    // success
    return {
      valid: true,
      message:
        "Blockchain and product verified successfully",
    };
  };