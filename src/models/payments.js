const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  amount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  notes: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    memberShip: {
      type: String,
      required: true,
    },
  },
});

const PaymentInformation = new mongoose.model(
  "PaymentInformation",
  paymentSchema
);

module.exports = PaymentInformation;
