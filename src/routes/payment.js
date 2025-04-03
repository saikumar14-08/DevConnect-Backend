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
      notes: {
        firstName,
        lastName,
        memberShip: order.notes.memberShip,
      },
    });
    const key_id = process.env.RAZORPAY_KEY_ID;
    await paymentInfo.save();
    // console.log({ ...paymentInfo.toObject(), key_id, emailId });

    res.status(201).json({ ...paymentInfo.toObject(), key_id, emailId });
  } catch (e) {
    res.send(e.message);
  }
});

paymentrouter.post("/payment/webhook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  try {
    const isValid = await validateWebhookSignature(
      JSON.stringify(req.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    console.log(isValid);
    if (!isValid) {
      res.status(401).send("Webhook is not valid");
    }
    // Update payment status in DB.
    const paymentDetails = await req.body.payload.payment.entity;
    const payment = await PaymentInformation.findOne({
      orderId: paymentDetails.orderId,
    });
    payment.status = paymentDetails.status;
    await payment.save();
    // Update premium flag in DB.
    const user = await User.findById({ _id: payment.userId });
    const membership = await User.findOne({
      memberShipType: payment.notes.memberShipType,
    });
    await User.save();
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = paymentrouter;
