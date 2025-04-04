const express = require("express");
const paymentrouter = express.Router();
const userAuth = require("../middleware/userAuth");
const instance = require("../utils/razorpay");
const PaymentInformation = require("../models/payments");
const { memberShipTypes } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
require("dotenv").config();

paymentrouter.post("/payment", userAuth, async (req, res) => {
  const { firstName, lastName, _id, emailId } = req.user;
  const { choice } = req.body;
  try {
    const order = await instance.orders.create({
      amount: memberShipTypes[choice] * 100,
      currency: "INR",
      receipt: "receipt#2",
      payment_capture: 1,
      notes: {
        firstName,
        lastName,
        memberShip: choice,
      },
    });
    console.log("Order: ", order);

    const paymentInfo = new PaymentInformation({
      userId: _id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      // notes: {
      //   firstName,
      //   lastName,
      //   memberShip: order.notes.memberShip,
      // },
      notes: order.notes,
    });
    const savedPayment = await paymentInfo.save();
    res.status(201).json({
      ...savedPayment.toObject(),
      key_id: process.env.RAZORPAY_KEY_ID,
      emailId,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
paymentrouter.post("/payment/webhook", async (req, res) => {
  const webhookSignature = req.get("X-Razorpay-Signature");
  try {
    console.log(`🔔 Webhook received`);
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.log(`❌ Invalid webhook signature`);
      return res.status(401).send("Invalid webhook signature");
    }

    const paymentDetails = req.body.payload.payment.entity;

    console.log(`✅ Payment Details:== `, paymentDetails);

    const payment = await PaymentInformation.findOne({
      orderId: paymentDetails.order_id,
    });

    // if (!payment) {
    //   console.log(`[${timestamp}] ⚠️ No matching payment found`);
    //   return res.status(404).send("Payment not found");
    // }

    payment.status = paymentDetails.status;
    await payment.save();
    console.log(`✅ Payment status updated`);

    if (["captured", "authorized"].includes(payment.status)) {
      const user = await User.findById(payment.userId);
      if (user) {
        user.isPremium = true;
        user.memberShipType = payment.notes.memberShip;
        await user.save();
        console.log(`🎉 User upgraded to premium`);
      }
    }

    return res.status(200).send("Webhook processed");
  } catch (e) {
    console.error(`🔴 Webhook error:`, e.message);
    return res.status(400).send(e.message);
  }
});

module.exports = paymentrouter;
