const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

// sign-up

const customerSignUp = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    // if customer still exists
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      return res
        .status(400)
        .json({ error: "Customer already exists with this email" });
    }
    // create a new customer user

    const newCustomer = new Customer({
      userName,
      email,
      password,
      isAdmin: false,
    });

    // Hash the password

    const saltRounds = 10;
    newCustomer.password = bcrypt.hashSync(password, saltRounds);

    await newCustomer.save();

    // generate JWT token for the customer
    const token = jwt.sign(
      {
        customerId: newCustomer._id,
        isAdmin: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    // set the token as a cookie or in the response header

    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "Customer signed up successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// customer sign-in

const customerSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({ error: "Customer not found" });
    }

    // verify password
    if (!bcrypt.compareSync(password, customer.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // jwt

    const token = jwt.sign(
      {
        customerId: customer._id,
        isAdmin: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Customer signed in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// sign-out

const customerSignOut = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Customer signed out successfully" });
};

module.exports = {
  customerSignUp,
  customerSignIn,
  customerSignOut,
};
