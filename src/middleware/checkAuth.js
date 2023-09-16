const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");

function userAuthorization(req, res, next) {
  const token = req.headers.authorization || req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is either an admin or a customer
    if (decodedToken.isAdmin) {
      req.isAdmin = true;
      req.isCustomer = false;
    } else {
      req.isAdmin = false;
      req.isCustomer = true;
    }

    req.customerId = decodedToken.customerId;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = userAuthorization;
