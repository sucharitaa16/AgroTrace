const Product = require("../models/Product");
const TransferRequest = require("../models/TransferRequest");
const User = require("../models/User");

const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");


// exports.requestTransfer = async (
//   req,
//   res
// ) => {
//   try {
//     const product = await Product.findOne({
//       productId: req.params.productId,
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // current owner
//     const currentOwner =
//       await User.findById(
//         product.currentOwner
//       );

//     if (!currentOwner) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Current owner not found",
//       });
//     }

//     // prevent self transfer
//     if (
//       product.currentOwner.toString() ===
//       req.user.id
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "You already own this product",
//       });
//     }

//     // generate otp
//     const otp = generateOTP();

//     // create transfer request
//     const request =
//       await TransferRequest.create({
//         product: product._id,
//         fromUser: product.currentOwner,
//         toUser: req.user.id,
//         otp,
//         expiresAt: new Date(
//           Date.now() + 5 * 60 * 1000
//         ),
//       });

//     // send otp to current owner's email
//     await sendEmail(
//       currentOwner.email,
//       "Product Transfer OTP",
//       `
// OTP for product transfer: ${otp}

// Product ID: ${product.productId}

// Do not share this OTP publicly.
//       `
//     );
// // await sendSMS(
// //   currentOwner.phone, 
// //   `OTP for product transfer: ${otp}\nProduct ID: ${product.productId}\nDo not share this OTP.`
// // );


//     res.status(201).json({
//       success: true,
//       message:
//         // "OTP sent to current owner's email",
//         "OTP sent to current owner's phone",
//       requestId: request._id,
//       otp
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.requestTransfer = async (req, res) => {
  try {
    // 1. Find the product
    const product = await Product.findOne({
      productId: req.params.productId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Prevent Self-Transfer / Pull Logic Check
    // The person requesting (req.user.id) should NOT be the current owner.
    if (product.currentOwner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You already own this product. You cannot request a transfer to yourself.",
      });
    }

    // 3. Fetch the current owner securely
    const currentOwner = await User.findById(product.currentOwner);

    if (!currentOwner) {
      return res.status(404).json({
        success: false,
        message: "Current owner of this product could not be found",
      });
    }

    // 4. Generate OTP
    const otp = generateOTP();

    // 5. Create the transfer request record
    const request = await TransferRequest.create({
      product: product._id,
      fromUser: product.currentOwner, // Current Owner (e.g., Farmer)
      toUser: req.user.id,            // Requester (e.g., Distributor)
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins expiry
    });

    // 6. Send OTP to the CURRENT OWNER (for approval)
    // Note: Ensure currentOwner.email and currentOwner.phone exist in DB to avoid validation errors
    await sendEmail(
      currentOwner.email,
      "Product Transfer Approval Required",
      `OTP for product transfer: ${otp}\nProduct ID: ${product.productId}\nDo not share this OTP.`
    );

    // If using SMS, uncomment and ensure currentOwner.phone is populated
    // await sendSMS(
    //   currentOwner.phone, 
    //   `OTP for product transfer: ${otp}\nProduct ID: ${product.productId}`
    // );

    // 7. Respond to the requester
    res.status(201).json({
      success: true,
      message: "Transfer request initiated. OTP sent to the current owner for verification.",
      requestId: request._id,
      // otp // Remove this in production so the requester can't see the OTP!
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message, // This will capture if "username is required" comes from DB validation
    });
  }
};




const BlockchainLedger = require(
  "../models/BlockchainLedger"
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

exports.verifyTransfer =
  async (req, res) => {
    try {
      const { otp } = req.body;

      const request =
        await TransferRequest.findById(
          req.params.requestId
        )
          .populate("product")
          .populate("toUser");

      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Request not found",
        });
      }

      if (request.verified) {
        return res.status(400).json({
          success: false,
          message:
            "Transfer already verified",
        });
      }

      if (request.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      const product =
        request.product;

        if (!product.verified) {
  return res.status(403).json({
    success: false,
    message:
      "Product is not physically verified yet",
  });
}

      // =========================
      // UPDATE OWNERSHIP
      // =========================

      product.currentOwner =
        request.toUser._id;

      product.currentOwnerRole =
        request.toUser.role;

      // =========================
      // ROLE BASED UPDATES
      // =========================

      if (
        request.toUser.role ===
        "MANUFACTURER"
      ) {
        product.status =
          "MANUFACTURING";

        product.manufacturer = {
          manufacturerRef:
            request.toUser._id,

          manufacturerId:
            request.toUser.customId,
        };
      }

      if (
        request.toUser.role ===
        "DISTRIBUTOR"
      ) {
        product.status =
          "DISTRIBUTION";

        product.distributor = {
          distributorRef:
            request.toUser._id,

          distributorId:
            request.toUser.customId,
        };
      }

      if (
        request.toUser.role ===
        "RETAILER"
      ) {
        product.status = "RETAIL";

        product.retailer = {
          retailerRef:
            request.toUser._id,

          retailerId:
            request.toUser.customId,
        };

        // Production URL
        const qr =
          await QRCode.toDataURL(
            `http://localhost:5173/trace/${product.productId}`
          );

        product.qrCode = qr;
      }

      // =========================
      // HISTORY
      // =========================

      product.history.push({
        role:
          request.toUser.role,

        ownerId:
          request.toUser._id,

        action: `Ownership transferred to ${request.toUser.role}`,

        timestamp: new Date(),
      });

      // =========================
      // GENERATE NEW PRODUCT HASH
      // =========================

      const newProductHash =
        generateProductHash(product);

      product.integrityHash =
        newProductHash;

      // =========================
      // GET PREVIOUS BLOCK
      // =========================

      const latestBlock =
        await BlockchainLedger.findOne(
          {
            productId:
              product.productId,
          }
        ).sort({
          blockNumber: -1,
        });

      const previousHash =
        latestBlock?.currentHash ||
        "GENESIS";

      const blockNumber =
        latestBlock
          ? latestBlock.blockNumber +
            1
          : 1;

      // =========================
      // CREATE BLOCK DATA
      // =========================

      const blockData = {
  productId:
    product.productId,

  blockNumber,

  previousHash,

  transactionType:
    request.toUser.role,

  performedBy: {
    userId:
      request.toUser._id.toString(),

    role:
      request.toUser.role,
  },

  data: {
    transferredTo:
      request.toUser.role,

    newOwner:
      request.toUser.customId,

    productStatus:
      product.status,

    action:
      `Ownership transferred to ${request.toUser.role}`,
  },

  productHash:
    newProductHash,

  timestamp: new Date(),
};

      // =========================
      // GENERATE BLOCK HASH
      // =========================

      const currentHash =
        generateHash(blockData);

      // =========================
      // SAVE BLOCKCHAIN ENTRY
      // =========================

      await BlockchainLedger.create({
        ...blockData,
        currentHash,
      });

      // =========================
      // SAVE PRODUCT
      // =========================

      await product.save();

      // =========================
      // MARK REQUEST VERIFIED
      // =========================

      request.verified = true;

      await request.save();

      // =========================
      // RESPONSE
      // =========================

      res.json({
        success: true,

        message:
          "Ownership transferred successfully",

        blockchainVerified: true,

        product,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Transfer verification failed",

        error: error.message,
      });
    }
  };