// const Product = require("../models/Product");

// const {
//   createBlock,
// } = require("../services/blockchain.service");

// const {
//   verifyBlockchain,
// } = require(
//   "../services/verifyBlockchain.service"
// );

// const {
//   rebuildProductFromChain,
// } = require(
//   "../services/rebuildProduct.service"
// );

// const {
//   generateProductHash,
// } = require(
//   "../utils/productHash"
// );



// // UPDATE PRODUCT
// exports.updateProduct = async (req, res) => {
//   try {

//     const product = await Product.findOne({
//       productId: req.params.productId,
//     });

//     if (!product) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     if (
//       product.currentOwner.toString() !==
//       req.user.id
//     ) {
//       return res.status(403).json({
//         message:
//           "Only current owner can update",
//       });
//     }

//     const role = req.user.role;

//     if (role === "MANUFACTURER") {
//       product.manufacturer = {
//         ...product.manufacturer,
//         ...req.body,
//       };
//     }

//     if (role === "DISTRIBUTOR") {
//       product.distributor = {
//         ...product.distributor,
//         ...req.body,
//       };
//     }

//     if (role === "RETAILER") {
//       product.retailer = {
//         ...product.retailer,
//         ...req.body,
//       };
//     }

//     product.integrityHash =
//       generateProductHash(product);

//     await product.save();

//     await createBlock({
//       productId: product.productId,

//       transactionType: role,

//       performedBy: {
//         userId: req.user.customId,
//         role: req.user.role,
//       },

//       data: req.body,
//     });

//     res.json(product);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message,
//     });

//   }
// };




// // SELL PRODUCT
// exports.sellProduct = async (req, res) => {
//   try {

//     const product = await Product.findOne({
//       productId: req.params.productId,
//     });

//     if (
//       product.currentOwner.toString() !==
//       req.user.id
//     ) {
//       return res.status(403).json({
//         message: "Unauthorized",
//       });
//     }

//     if (req.user.role !== "RETAILER") {
//       return res.status(403).json({
//         message:
//           "Only retailer can sell product",
//       });
//     }

//     const {
//       name,
//       phone,
//       address,
//     } = req.body;

//     product.customer = {
//       name,
//       phone,
//       address,
//       purchasedAt: new Date(),
//     };

//     product.status = "SOLD";

//     product.history.push({
//       role: "CUSTOMER",
//       ownerId: "PUBLIC_CUSTOMER",
//       action: `Purchased by ${name}`,
//     });

//     product.integrityHash =
//       generateProductHash(product);

//     await product.save();

//     await createBlock({
//       productId: product.productId,

//       transactionType: "SOLD",

//       performedBy: {
//         userId: req.user.customId,
//         role: req.user.role,
//       },

//       data: {
//         customer: {
//           name,
//           phone,
//           address,
//         },
//       },
//     });

//     res.json(product);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message,
//     });

//   }
// };




// // GET HISTORY
// exports.getHistory = async (
//   req,
//   res
// ) => {

//   try {

//     const { productId } = req.params;

//     const verification =
//       await verifyBlockchain(
//         productId
//       );

//     if (verification.valid) {

//       const product =
//         await Product.findOne({
//           productId,
//         });

//       return res.json({
//         success: true,

//         blockchainVerified: true,

//         trustedSource:
//           "PRODUCT_COLLECTION",

//         product,
//       });
//     }

//     const rebuiltProduct =
//       await rebuildProductFromChain(
//         productId
//       );

//     return res.status(409).json({
//       success: false,

//       blockchainVerified: false,

//       warning:
//         "Product collection compromised. Showing reconstructed blockchain data.",

//       trustedSource:
//         "BLOCKCHAIN_RECONSTRUCTION",

//       verification,

//       product: rebuiltProduct,
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message,
//     });

//   }
// };




// // CREATE BATCH
// exports.createBatch = async (
//   req,
//   res
// ) => {

//   try {

//     if (req.user.role !== "FARMER") {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Only farmers can create batches",
//       });
//     }

//     const {
//       productName,
//       quantity,
//       category,
//       farmLocation,
//       cropType,
//       harvestDate,
//       farmingMethod,
//     } = req.body;

//     const productId =
//       "PROD" +
//       Date.now().toString().slice(-6);

//     const product =
//       await Product.create({

//         productId,
//         productName,
//         quantity,
//         category,

//         currentOwner: req.user.id,

//         currentOwnerRole: "FARMER",

//         farmer: {
//           farmerId:
//             req.user.customId,

//           farmerRef:
//             req.user.id,

//           farmLocation,
//           cropType,
//           harvestDate,
//           farmingMethod,
//         },

//         history: [
//           {
//             role: "FARMER",
//             ownerId:
//               req.user.customId,

//             action:
//               "Batch Created",
//           },
//         ],
//       });

//     product.integrityHash =
//       generateProductHash(product);

//     await product.save();

//     const productHash =
//       generateProductHash(product);

//     await createBlock({

//       productId:
//         product.productId,

//       transactionType:
//         "CREATE_BATCH",

//       performedBy: {
//         userId:
//           req.user.customId,

//         role:
//           req.user.role,
//       },

//       data: {
//         productName,
//         quantity,
//         category,
//         farmLocation,
//         cropType,
//       },

//       productHash,
//     });

//     res.status(201).json({
//       success: true,

//       message:
//         "Batch created successfully",

//       product,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };




// // GET MY PRODUCTS
// exports.getMyProducts = async (
//   req,
//   res
// ) => {

//   try {

//     let query = {};

//     if (
//       req.user.role === "FARMER"
//     ) {

//       query = {
//         "farmer.farmerRef":
//           req.user.id,
//       };

//     }

//     else if (
//       req.user.role ===
//       "MANUFACTURER"
//     ) {

//       query = {
//         "manufacturer.manufacturerRef":
//           req.user.id,
//       };

//     }

//     else if (
//       req.user.role ===
//       "DISTRIBUTOR"
//     ) {

//       query = {
//         "distributor.distributorRef":
//           req.user.id,
//       };

//     }

//     else if (
//       req.user.role ===
//       "RETAILER"
//     ) {

//       query = {
//         "retailer.retailerRef":
//           req.user.id,
//       };

//     }

//     else {

//       return res.status(403).json({
//         success: false,
//         message: "Invalid role",
//       });

//     }

//     const products =
//       await Product.find(query)
//         .sort({
//           createdAt: -1,
//         });

//     res.status(200).json({
//       success: true,

//       totalProducts:
//         products.length,

//       products,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };


























const Product = require("../models/Product");

const {
  createBlock,
} = require("../services/blockchain.service");

const {
  verifyBlockchain,
} = require(
  "../services/verifyBlockchain.service"
);

const {
  rebuildProductFromChain,
} = require(
  "../services/rebuildProduct.service"
);

const {
  generateProductHash,
} = require(
  "../utils/productHash"
);



// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findOne({
      productId: req.params.productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      product.currentOwner.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Only current owner can update",
      });
    }

    const role = req.user.role;

    if (role === "MANUFACTURER") {
      product.manufacturer = {
        ...product.manufacturer,
        ...req.body,
      };
    }

    if (role === "DISTRIBUTOR") {
      product.distributor = {
        ...product.distributor,
        ...req.body,
      };
    }

    if (role === "RETAILER") {
      product.retailer = {
        ...product.retailer,
        ...req.body,
      };
    }

    product.integrityHash =
      generateProductHash(product);

    await product.save();

    const productHash =
      generateProductHash(product);

    await createBlock({
      productId: product.productId,

      transactionType: role,

      performedBy: {
        userId: req.user.customId,
        role: req.user.role,
      },

      data: req.body,

      productHash
    });

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};




// SELL PRODUCT
exports.sellProduct = async (req, res) => {
  try {

    const product = await Product.findOne({
      productId: req.params.productId,
    });

    if (
      product.currentOwner.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "RETAILER") {
      return res.status(403).json({
        message:
          "Only retailer can sell product",
      });
    }

    const {
      name,
      phone,
      address,
    } = req.body;

    product.customer = {
      name,
      phone,
      address,
      purchasedAt: new Date(),
    };

    product.status = "SOLD";

    product.history.push({
      role: "CUSTOMER",
      ownerId: "PUBLIC_CUSTOMER",
      action: `Purchased by ${name}`,
    });

    product.integrityHash =
      generateProductHash(product);

    await product.save();

    const productHash =
      generateProductHash(product);


    await createBlock({
      productId: product.productId,

      transactionType: "SOLD",

      performedBy: {
        userId: req.user.customId,
        role: req.user.role,
      },

      data: {
        customer: {
          name,
          phone,
          address,
        },
      },
      productHash
    });

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};




// GET HISTORY
// exports.getHistory = async (
//   req,
//   res
// ) => {

//   try {

//     const { productId } = req.params;

//     const verification =
//       await verifyBlockchain(
//         productId
//       );

//     if (verification.valid) {

//       const product =
//         await Product.findOne({
//           productId,
//         });

//       return res.json({
//         success: true,

//         blockchainVerified: true,

//         trustedSource:
//           "PRODUCT_COLLECTION",

//         product,
//       });
//     }

//     const rebuiltProduct =
//       await rebuildProductFromChain(
//         productId
//       );

//     return res.status(409).json({
//       success: false,

//       blockchainVerified: false,

//       warning:
//         "Product collection compromised. Showing reconstructed blockchain data.",

//       trustedSource:
//         "BLOCKCHAIN_RECONSTRUCTION",

//       verification,

//       product: rebuiltProduct,
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message,
//     });

//   }
// };



// exports.getHistory = async (
//   req,
//   res
// ) => {

//   try {

//     const { productId } = req.params;

//     const product =
//       await Product.findOne({
//         productId,
//       });

//     if (!product) {

//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });

//     }

//     return res.json({
//       success: true,
//       blockchainVerified: false,
//       trustedSource:
//         "PRODUCT_COLLECTION",
//       product,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };
// const Product = require(
//   "../models/Product"
// );

// const {
//   verifyBlockchain,
// } = require(
//   "../services/blockchain.service"
// );

exports.getHistory = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    // find product
    const product =
      await Product.findOne({
        productId,
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // verify blockchain
    const blockchainResult =
      await verifyBlockchain(
        productId
      );

    // blockchain tampered
    if (
      !blockchainResult.valid
    ) {
      return res.status(409).json({
        success: false,

        blockchainVerified: false,

        trustedSource:
          "BLOCKCHAIN_LEDGER",

        message:
          blockchainResult.message,

        product,
      });
    }

    // blockchain verified
    return res.status(200).json({
      success: true,

      blockchainVerified: true,

      trustedSource:
        "BLOCKCHAIN_LEDGER",

      message:
        blockchainResult.message,

      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// CREATE BATCH
exports.createBatch = async (
  req,
  res
) => {

  try {

    if (req.user.role !== "FARMER") {
      return res.status(403).json({
        success: false,
        message:
          "Only farmers can create batches",
      });
    }

    const {
      productName,
      quantity,
      category,
      farmLocation,
      cropType,
      harvestDate,
      farmingMethod,
    } = req.body;

    const productId =
      "PROD" +
      Date.now().toString().slice(-6);

    const product =
      await Product.create({

        productId,
        productName,
        quantity,
        category,

        currentOwner: req.user.id,

        currentOwnerRole: "FARMER",

        farmer: {
          farmerId:
            req.user.customId,

          farmerRef:
            req.user.id,

          farmLocation,
          cropType,
          harvestDate,
          farmingMethod,
        },

        history: [
          {
            role: "FARMER",
            ownerId:
              req.user.customId,

            action:
              "Batch Created",
          },
        ],
      });

    product.integrityHash =
      generateProductHash(product);

    await product.save();

    const productHash =
      generateProductHash(product);

    await createBlock({

      productId:
        product.productId,

      transactionType:
        "CREATE_BATCH",

      performedBy: {
        userId:
          req.user.customId,

        role:
          req.user.role,
      },

      data: {
        productName,
        quantity,
        category,
        farmLocation,
        cropType,
      },

      productHash,
    });

    res.status(201).json({
      success: true,

      message:
        "Batch created successfully",

      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// GET MY PRODUCTS
exports.getMyProducts = async (
  req,
  res
) => {

  try {

    let query = {};

    if (
      req.user.role === "FARMER"
    ) {

      query = {
        "farmer.farmerRef":
          req.user.id,
      };

    }

    else if (
      req.user.role ===
      "MANUFACTURER"
    ) {

      query = {
        "manufacturer.manufacturerRef":
          req.user.id,
      };

    }

    else if (
      req.user.role ===
      "DISTRIBUTOR"
    ) {

      query = {
        "distributor.distributorRef":
          req.user.id,
      };

    }

    else if (
      req.user.role ===
      "RETAILER"
    ) {

      query = {
        "retailer.retailerRef":
          req.user.id,
      };

    }

    else {

      return res.status(403).json({
        success: false,
        message: "Invalid role",
      });

    }

    const products =
      await Product.find(query)
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,

      totalProducts:
        products.length,

      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};