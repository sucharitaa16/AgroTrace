const BlockchainLedger = require(
  "../models/BlockchainLedger"
);

exports.rebuildProductFromChain =
  async (productId) => {

    const chain =
      await BlockchainLedger.find({
        productId,
      }).sort({ blockNumber: 1 });

    if (!chain.length) {
      return null;
    }

    let rebuiltProduct = {
      productId,
    };

    for (const block of chain) {

      switch (
        block.transactionType
      ) {

        case "CREATE_BATCH":

          rebuiltProduct = {
            ...rebuiltProduct,

            productName:
              block.data.productName,

            quantity:
              block.data.quantity,

            category:
              block.data.category,

            farmer: {
              farmLocation:
                block.data
                  .farmLocation,

              cropType:
                block.data.cropType,
            },

            status: "CREATED",
          };

          break;

        case "MANUFACTURING":

          rebuiltProduct.manufacturer =
            {
              ...block.data,
            };

          rebuiltProduct.status =
            "MANUFACTURING";

          break;

        case "DISTRIBUTION":

          rebuiltProduct.distributor =
            {
              ...block.data,
            };

          rebuiltProduct.status =
            "DISTRIBUTION";

          break;

        case "RETAIL":

          rebuiltProduct.retailer =
            {
              ...block.data,
            };

          rebuiltProduct.status =
            "RETAIL";

          break;

        case "SOLD":

          rebuiltProduct.customer =
            block.data.customer;

          rebuiltProduct.status =
            "SOLD";

          break;
      }
    }

    return rebuiltProduct;
  };