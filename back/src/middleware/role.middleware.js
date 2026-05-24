const Product = require("../models/Product");
const TransferRequest = require("../models/TransferRequest");
const generateOTP = require("../utils/generateOTP");

exports.requestTransfer = async (req, res) => {
  try {
    const product = await Product.findOne({
      productId: req.params.productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const otp = generateOTP();

    const request = await TransferRequest.create({
      product: product._id,
      fromUser: product.currentOwner,
      toUser: req.user.id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    res.json({
      message: "OTP generated",
      otp,
      request,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};