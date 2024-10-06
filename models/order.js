const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  product_price: {
    type: Number,
    required: true,
    min: 100, // Minimum price of 100
    max: 1000, // Maximum price of 1000
  },
  product_quantity: {
    type: Number,
    required: true,
    min: 1, // Minimum quantity of 1
    max: 10, // Maximum quantity of 10
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["new", "shipped", "fulfilled"], // Valid statuses
    default: "new", // Default status when an order is created
  },
});

module.exports = mongoose.model("Order", orderSchema);
