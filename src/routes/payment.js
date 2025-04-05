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
  const { firstName, lastName, emailId } = req.user;
  const { choice } = req.body;
  try {
    const order = await instance.orders.create({
      amount: memberShipTypes[choice] * 100,
      currency: "INR",
      receipt: "receipt#2",
      notes: {
        firstName,
        lastName,
        memberShip: choice,
      },
    });
    const paymentInfo = new PaymentInformation({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
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
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      return res.status(401).send("Invalid webhook signature");
    }
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await PaymentInformation.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.memberShipType = payment.notes.memberShip;
    await user.save();
    return res.status(200).send("Webhook processed Successfully");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = paymentrouter;
