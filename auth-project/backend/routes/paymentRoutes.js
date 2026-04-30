import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);
router.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Pro Upgrade" },
          unit_amount: 5000
        },
        quantity: 1
      }
    ],
    mode: "payment",
    //success_url: "http://localhost:3000/success",
    //cancel_url: "http://localhost:3000/cancel"
    success_url: "https://your-vercel-app.vercel.app/success",
cancel_url: "https://your-vercel-app.vercel.app/cancel"
  });

  res.json({ url: session.url });
});

export default router;