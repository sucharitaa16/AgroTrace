// const crypto = require("crypto");

// exports.generateProductHash = (
//   product
// ) => {
//   const cleanData = {
//     productId: product.productId,
//     productName: product.productName,
//     quantity: product.quantity,
//     category: product.category,
//     status: product.status,

//     farmer: product.farmer,
//     manufacturer:
//       product.manufacturer,
//     distributor:
//       product.distributor,
//     retailer: product.retailer,
//     customer: product.customer,
//   };

//   return crypto
//     .createHash("sha256")
//     .update(JSON.stringify(cleanData))
//     .digest("hex");
// };

const {
  generateHash,
} = require("./hashGenerator");

exports.generateProductHash =
  (product) => {

    const cleanData = {

      productId:
        product.productId,

      productName:
        product.productName,

      category:
        product.category,

      quantity:
        product.quantity,

      currentOwner:
        product.currentOwner?.toString(),

      currentOwnerRole:
        product.currentOwnerRole,

      status:
        product.status,

      farmer:
        product.farmer,

      manufacturer:
        product.manufacturer,

      distributor:
        product.distributor,

      retailer:
        product.retailer,

      history:
        product.history.map(
          (h) => ({
            role: h.role,
            action: h.action,
            ownerId:
              h.ownerId?.toString(),
          })
        ),

      // EXCLUDED:
      // verified
      // qrCode
      // createdAt
      // updatedAt
      // __v
    };

    return generateHash(
      cleanData
    );
  };