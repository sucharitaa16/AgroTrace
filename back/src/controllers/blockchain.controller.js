const { verifyBlockchain } = require("../services/verifyBlockchain.service");

exports.verifyChain = async (req, res) => {
  try {
    const result = await verifyBlockchain(req.params.productId);

    if (!result.valid) {
      return res.status(409).json({
        success: false,
        blockchainVerified: false,
        message: result.message,
        ...(result.blockNumber && { blockNumber: result.blockNumber }),
      });
    }

    res.status(200).json({
      success: true,
      blockchainVerified: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};