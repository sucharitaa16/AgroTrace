const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: [
        "FARMER",
        "MANUFACTURER",
        "DISTRIBUTOR",
        "RETAILER",
      ],
      required: true,
    },

    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    phone: String,

    address: String,

    companyName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);