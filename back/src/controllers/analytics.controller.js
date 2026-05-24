const Product = require("../models/Product");
const mongoose=require('mongoose');

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let analytics = {};

    // ==========================================
    // COMMON DATE CALCULATIONS
    // ==========================================

    const currentDate = new Date();

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const firstDayOfYear = new Date(
      currentDate.getFullYear(),
      0,
      1
    );

    // ==========================================
    // FARMER ANALYTICS
    // ==========================================

    if (role === "FARMER") {
      const products = await Product.find({
        "farmer.farmerRef": userId,
      });

      const totalBatches = products.length;

      const soldProducts = products.filter(
        (p) => p.status === "SOLD"
      ).length;

      const activeProducts = products.filter(
        (p) => p.status !== "SOLD"
      ).length;

      // monthly batches
      const monthlyBatches =
        await Product.countDocuments({
          "farmer.farmerRef": userId,
          createdAt: {
            $gte: firstDayOfMonth,
          },
        });

      // yearly batches
      const yearlyBatches =
        await Product.countDocuments({
          "farmer.farmerRef": userId,
          createdAt: {
            $gte: firstDayOfYear,
          },
        });

      // category analytics
      const categoryStats =
  await Product.aggregate([
    {
      $match: {
        "farmer.farmerRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id: "$category",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        category: "$_id",
        total: 1,
      },
    },
  ]);
      // status analytics
      const statusStats =
  await Product.aggregate([
    {
      $match: {
        "farmer.farmerRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id: "$status",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $project: {
        _id: 0,
        status: "$_id",
        total: 1,
      },
    },
  ]);

      // recent products
      const recentProducts =
        await Product.find({
          "farmer.farmerRef": userId,
        })
          .sort({ createdAt: -1 })
          

      // latest transfers
      const latestTransfers =
        await Product.find({
          "farmer.farmerRef": userId,
        })
          .sort({ updatedAt: -1 })
          .limit(5)
          .select(
            "productId currentOwnerRole updatedAt"
          );

      analytics = {
        role,

        overview: {
          totalBatches,
          soldProducts,
          activeProducts,
        },

        growth: {
          monthlyBatches,
          yearlyBatches,
        },

        categoryStats,

        statusStats,

        recentProducts,

        latestTransfers,
      };
    }

    // ==========================================
    // MANUFACTURER ANALYTICS
    // ==========================================

    else if (
      role === "MANUFACTURER"
    ) {
      const products = await Product.find({
        "manufacturer.manufacturerRef":
          userId,
      });

      const totalManufactured =
        products.length;

      const inDistribution =
        products.filter(
          (p) =>
            p.status ===
            "DISTRIBUTION"
        ).length;

      const soldProducts = products.filter(
        (p) => p.status === "SOLD"
      ).length;

      // packaging analytics
      const packagingStats =
  await Product.aggregate([
    {
      $match: {
        "manufacturer.manufacturerRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id:
          "$manufacturer.packagingType",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $match: {
        _id: {
          $ne: null,
        },
      },
    },

    {
      $project: {
        _id: 0,
        packagingType: "$_id",
        total: 1,
      },
    },
  ]);
      // factory analytics
      const factoryStats =
  await Product.aggregate([
    {
      $match: {
        "manufacturer.manufacturerRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id:
          "$manufacturer.factoryLocation",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $match: {
        _id: {
          $ne: null,
        },
      },
    },

    {
      $project: {
        _id: 0,
        factoryLocation: "$_id",
        total: 1,
      },
    },
  ]);

      // monthly manufactured
      const monthlyManufactured =
        await Product.countDocuments({
          "manufacturer.manufacturerRef":
            userId,

          updatedAt: {
            $gte: firstDayOfMonth,
          },
        });

      // recent products
      const recentProducts =
        await Product.find({
          "manufacturer.manufacturerRef":
            userId,
        })
          .sort({ updatedAt: -1 })
          .limit(5);

      analytics = {
        role,

        overview: {
          totalManufactured,
          inDistribution,
          soldProducts,
        },

        growth: {
          monthlyManufactured,
        },

        packagingStats,

        factoryStats,

        recentProducts,
      };
    }

    // ==========================================
    // DISTRIBUTOR ANALYTICS
    // ==========================================

    else if (
      role === "DISTRIBUTOR"
    ) {
      const products = await Product.find({
        "distributor.distributorRef":
          userId,
      });

      const totalDistributed =
        products.length;

      const deliveredToRetail =
        products.filter(
          (p) =>
            p.status === "RETAIL"
        ).length;

      const soldProducts = products.filter(
        (p) => p.status === "SOLD"
      ).length;

      // transport method analytics
     const transportStats =
  await Product.aggregate([
    {
      $match: {
        "distributor.distributorRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id:
          "$distributor.transportMethod",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $match: {
        _id: {
          $ne: null,
        },
      },
    },

    {
      $project: {
        _id: 0,
        transportMethod: "$_id",
        total: 1,
      },
    },
  ]);

      // warehouse analytics
      const warehouseStats =
  await Product.aggregate([
    {
      $match: {
        "distributor.distributorRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id:
          "$distributor.warehouseLocation",

        total: {
          $sum: 1,
        },
      },
    },

    {
      $match: {
        _id: {
          $ne: null,
        },
      },
    },

    {
      $project: {
        _id: 0,
        warehouseLocation: "$_id",
        total: 1,
      },
    },
  ]);

      // recent deliveries
      const recentDeliveries =
        await Product.find({
          "distributor.distributorRef":
            userId,
        })
          .sort({ updatedAt: -1 })
          

      analytics = {
        role,

        overview: {
          totalDistributed,
          deliveredToRetail,
          soldProducts,
        },

        transportStats,

        warehouseStats,

        recentDeliveries,
      };
    }

    // ==========================================
    // RETAILER ANALYTICS
    // ==========================================

    else if (role === "RETAILER") {
      const products = await Product.find({
        "retailer.retailerRef":
          userId,
      });

      const totalProducts =
        products.length;

      const soldProducts = products.filter(
        (p) => p.status === "SOLD"
      ).length;

      const unsoldProducts =
        products.filter(
          (p) =>
            p.status === "RETAIL"
        ).length;

      // revenue
      let totalRevenue = 0;

      products.forEach((product) => {
        if (
          product.status === "SOLD"
        ) {
          totalRevenue +=
            product.retailer
              ?.retailPrice || 0;
        }
      });

      // monthly revenue
      let monthlyRevenue = 0;

      products.forEach((product) => {
        if (
          product.status === "SOLD" &&
          product.updatedAt >=
            firstDayOfMonth
        ) {
          monthlyRevenue +=
            product.retailer
              ?.retailPrice || 0;
        }
      });

      // category sales
      const categorySales =
  await Product.aggregate([
    {
      $match: {
        "retailer.retailerRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),

        status: "SOLD",
      },
    },

    {
      $group: {
        _id: "$category",

        totalSold: {
          $sum: 1,
        },

        revenue: {
          $sum:
            "$retailer.retailPrice",
        },
      },
    },
  ]);
      // customer analytics
      const recentCustomers =
        await Product.find({
          "retailer.retailerRef":
            userId,

          status: "SOLD",
        })
          .sort({ updatedAt: -1 })
          .limit(5)
          .select(
            "customer productName retailer.retailPrice"
          );

      // top selling products
      const topProducts =
  await Product.aggregate([
    {
      $match: {
        "retailer.retailerRef":
          new mongoose.Types.ObjectId(
            req.user.id
          ),
      },
    },

    {
      $group: {
        _id: "$productName",

        totalSold: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        totalSold: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $project: {
        _id: 0,
        productName: "$_id",
        totalSold: 1,
      },
    },
  ]);
      analytics = {
        role,

        overview: {
          totalProducts,
          soldProducts,
          unsoldProducts,
        },

        revenue: {
          totalRevenue,
          monthlyRevenue,
        },

        categorySales,

        topProducts,

        recentCustomers,
      };
    }

    // ==========================================
    // INVALID ROLE
    // ==========================================

    else {
      return res.status(403).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};