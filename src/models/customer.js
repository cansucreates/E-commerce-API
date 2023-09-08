const mongoose = require("mongoose");
const Cart = require("./cart");

const addressSchema = new mongoose.Schema({
  apartmentNo: { type: Number },
  streetNo: { type: Number },
  buildingNo: { type: Number },
  city: { type: String },
  country: { type: String },
});

const customerSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name must not be empty"],
      minlength: [4, "Username must have more than 4 letters."],
      index: { unique: true },
    },
    email: {
      type: String,
      required: [true, "Email must not be empty"],
      unique: [true, "This email already used."],
      validate: {
        validator: function (value) {
          // Check if it's a valid email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "The email should be a valid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          // Check if it contains at least one number, one uppercase letter, one lowercase letter, and at least 5 characters long
          const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
          return passwordRegex.test(value);
        },
        message:
          "Password must contain at least one number, one uppercase letter, one lowercase letter, and be at least 5 characters long.",
      },
    },
    address: {
      type: addressSchema,
    },
    phoneNumber: {
      type: Number,
    },
    cart: {
      type: [Cart],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
