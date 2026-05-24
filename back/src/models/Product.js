const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
    },

    integrityHash: {
  type: String,
},

    productName: String,

    quantity: Number,

    category: String,

    currentOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    currentOwnerRole: String,

    status: {
      type: String,
      enum: [
        "CREATED",
        "MANUFACTURING",
        "DISTRIBUTION",
        "RETAIL",
        "SOLD",
      ],
      default: "CREATED",
    },

    farmer: {
      farmerId: String,
      farmerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      farmLocation: String,
      cropType: String,
      harvestDate: Date,
      farmingMethod: String,
    },

    manufacturer: {
      manufacturerId: String,
      manufacturerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      manufacturingDate: Date,
      factoryLocation: String,
      packagingType: String,
      ingredientsUsed: String,
    },

    distributor: {
      distributorId: String,
      distributorRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      warehouseLocation: String,
      transportMethod: String,
      dispatchDate: Date,
    },

    retailer: {
      retailerId: String,
      retailerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      storeLocation: String,
      shelfDate: Date,
      retailPrice: Number,
    },

    customer: {
      name: String,
      phone: String,
      address: String,
      purchasedAt: Date,
    },

    history: [
      {
        role: String,

        ownerId: String,

        action: String,

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    verified: {
  type: Boolean,
  default: false,
},

    qrCode: String,
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);