import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Stripe from "stripe";

const router = express.Router();

// 🔥 Stripe init (safe)
const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET environment variable. Add it to backend/.env or your system environment.");
}
const stripe = new Stripe(stripeSecret);

// 💳 Checkout route
router.post("/checkout", async (req, res) => {
  try {
    // ❗ debug (optional remove later)
    console.log("Stripe key:", process.env.STRIPE_SECRET ? "Loaded ✅" : "Missing ❌");
    console.log("Stripe key:", process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Pro Upgrade" },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      // 🔥 IMPORTANT (production ready URLs)
      success_url: "https://prodesk-capstone-taskmatrix-ojke-prhvsvmae.vercel.app/success",
      cancel_url: "https://prodesk-capstone-taskmatrix-ojke-prhvsvmae.vercel.app/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log("Stripe Error ❌", error.message);
    res.status(500).json({ message: "Payment failed ❌" });
  }
});

export default router;