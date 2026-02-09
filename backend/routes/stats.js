const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const stripe = require("stripe");

dotenv.config();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Dashboard istatistikleri getir
router.get("/", async (req, res) => {
  try {
    // Toplam müşteri sayısı
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Toplam satılan ürün sayısı
    const orders = await Order.find({ status: "completed" });
    let totalProductsSold = 0;
    orders.forEach((order) => {
      order.products.forEach((product) => {
        totalProductsSold += product.quantity;
      });
    });

    // Toplam gelir (veritabanından)
    let totalRevenueFromDB = 0;
    orders.forEach((order) => {
      totalRevenueFromDB += order.totalAmount;
    });

    // Stripe'dan toplam geliri al
    let totalRevenueFromStripe = 0;
    try {
      const charges = await stripeClient.charges.list({
        limit: 100,
      });

      charges.data.forEach((charge) => {
        if (charge.paid) {
          totalRevenueFromStripe += charge.amount / 100; // Stripe amount is in cents
        }
      });
    } catch (stripeError) {
      console.log("Stripe error:", stripeError.message);
      // Eğer Stripe erişilemezse, DB'den gelen değeri kullan
      totalRevenueFromStripe = totalRevenueFromDB;
    }

    // Son 6 ay ürün satış verileri
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyProductSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: "completed",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalQuantity: {
            $sum: "$products.quantity",
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const monthNames = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];

    const formattedProductSales = monthlyProductSales.map((item) => ({
      name: monthNames[item._id.month - 1],
      satilanUrunSayisi: item.totalQuantity,
    }));

    // Son 6 ay müşteri sayısı
    const monthlyCustomers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const formattedCustomers = monthlyCustomers.map((item) => ({
      name: monthNames[item._id.month - 1],
      musteriSayisi: item.count,
    }));

    res.status(200).json({
      totalCustomers,
      totalProductsSold,
      totalRevenue: totalRevenueFromStripe || totalRevenueFromDB,
      monthlyProductSales: formattedProductSales,
      monthlyCustomers: formattedCustomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
