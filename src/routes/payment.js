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
    const paymentInfo = new PaymentInformation({
      userId: _id,
      orderId: order.id,
      amount: order?.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: {
        firstName,
        lastName,
        memberShip: order.notes.memberShip,
      },
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
  const signature = req.headers["x-razorpay-signature"];
  try {
    console.log("Web hook called");
    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isValid) {
      console.log("Invalid webhook signature");
      res.status(401).send("Webhook is not valid");
    }
    console.log("Valid Web hook");
    // Update payment status in DB.
    const paymentDetails = await req.body.payload.payment.entity;
    console.log("Payment Details: ===== ", paymentDetails);

    const payment = await PaymentInformation.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;

    await payment.save();
    console.log("Payment Saved");
    // Update premium flag in DB.

    if (payment.status === "captured" || payment.status === "authorized") {
      const user = await User.findById({ _id: payment.userId });
      user.isPremium = true;
      user.memberShipType = payment.notes.memberShipType;
      console.log(user);
      await user.save();
    }
    res.status(200).send("Webhook executed successfully");
    const user = await User.findById({ _id: payment.userId });
    console.log(user);
    const membership = await User.findOne({
      memberShipType: payment.notes.memberShipType,
    });
    console.log("User Saved");
    await User.save();
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = paymentrouter;
