const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ShopItem",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    orderStatus: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
    otherInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", ordersSchema);
