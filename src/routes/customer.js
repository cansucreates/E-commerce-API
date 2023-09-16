const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const customerAuth = require("../controllers/customerAuth");
const userAuthorization = require("../middleware/checkAuth");

router.get("/items", userAuthorization, customerController.getAllItems);
router.get(
  "/items/:itemId",
  userAuthorization,
  customerController.getSingleItem
);
router.get("/filter-items", userAuthorization, customerController.filterItems);
router.get("/search-items", userAuthorization, customerController.searchItems);
router.post("/cart", userAuthorization, customerController.addToCart);
router.post("/checkout", userAuthorization, customerController.checkout);
// -----

router.post("/signup", customerAuth.customerSignUp);
router.post("/signin", customerAuth.customerSignIn);
router.post("/signout", userAuthorization, customerAuth.customerSignOut);

/// -----
router.get(
  "/orders/:customerId",
  userAuthorization,
  customerController.fetchOrders
);
router.get("/profile", userAuthorization, customerController.getProfile);
router.put("/profile", userAuthorization, customerController.updateProfile);
// router.put("/cart/:id", userAuthorization, customerController.updateCartItem);
router.delete(
  "/cart/:id",
  userAuthorization,
  customerController.deleteCartItem
);

module.exports = router;
