const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

// admin sign-up

const adminSignUp = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    // if admin still exists
    const adminExists = await Customer.findOne({ email });

    if (adminExists) {
      return res
        .status(400)
        .json({ error: "Admin already exists with this email" });
    }
    // create a new admin user

    const newAdmin = new Customer({
      userName,
      email,
      password,
      isAdmin: true,
    });

    // Hash the password

    const saltRounds = 10;
    newAdmin.password = bcrypt.hashSync(password, saltRounds);

    await newAdmin.save();

    // generate JWT token for the customer
    const token = jwt.sign(
      {
        customerId: newAdmin._id,
        isAdmin: true,
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

// sign-in
const adminSignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // finding the admin by email
    const admin = await Customer.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    // checking if the user is an admin
    if (!admin.isAdmin) {
      return res.status(403).json({ error: "Access forbidden" });
    }

    // verifying the password
    if (!bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // jwt token
    const token = jwt.sign(
      {
        userId: admin._id,
        isAdmin: admin.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    // setting the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Admin signed in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// sign-out controller
const adminSignOut = (req, res) => {
  // clear the token or session
  res.clearCookie("token");

  res.status(200).json({ message: "Admin signed out successfully" });
};

module.exports = {
  adminSignUp,
  adminSignIn,
  adminSignOut,
};
