const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Order = require("../models/Order.js");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const { products, user, cargoFee } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));

  if (cargoFee !== 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Hızlı Kargo",
        },
        unit_amount: cargoFee * 100,
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_DOMAIN}/success`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/cart`,
    });

    // Sipariş oluştur
    const totalAmount = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    const newOrder = new Order({
      user: user._id || null,
      userEmail: user.email,
      products: products.map((product) => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      })),
      totalAmount: totalAmount,
      cargoFee: cargoFee,
      stripeSessionId: session.id,
      status: "pending",
    });

    await newOrder.save();

    res.status(200).json({ url: session.url, orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

// Webhook for Stripe payment completion
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Siparişi tamamlandı olarak güncelle
      await Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "completed" },
        { new: true }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.log("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
