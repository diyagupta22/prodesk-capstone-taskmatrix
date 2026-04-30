import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe("sk_test_51QVGZfSF3FPOAQllGj2zpvNK3gfQeNiwz9ihVRwIJ2m46q2Z69lW4nbgaMFkkUzD411TpK4stnj0XDDL3ZEHHZaw00PKBa9Z98");

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
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel"
  });

  res.json({ url: session.url });
});

export default router;