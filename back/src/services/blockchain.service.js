const BlockchainLedger = require(
  "../models/BlockchainLedger"
);

const {
  generateHash,
} = require("../utils/hashGenerator");

exports.createBlock = async ({
  productId,
  transactionType,
  performedBy,
  data,
  productHash,
}) => {

  // last block
  const lastBlock =
    await BlockchainLedger.findOne({
      productId,
    }).sort({ blockNumber: -1 });

  const previousHash = lastBlock
    ? lastBlock.currentHash
    : "GENESIS_BLOCK";

  const blockNumber = lastBlock
    ? lastBlock.blockNumber + 1
    : 1;

  // block payload
  const blockData = {
    productId,

    blockNumber,

    previousHash,

    transactionType,

    performedBy,

    data,

    productHash,

    timestamp: new Date(),
  };

  // generate block hash
  const currentHash =
    generateHash(blockData);

  // create block
  const block =
    await BlockchainLedger.create({
      ...blockData,
      currentHash,
    });

  return block;
};