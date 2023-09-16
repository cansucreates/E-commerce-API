const express = require("express");
const router = express.Router();
const shopItemController = require("../controllers/adminController");
const adminAuth = require("../controllers/adminAuth");
const userAuthorization = require("../middleware/checkAuth");

// signin, signup and signoff routes
router.post("/signup", adminAuth.adminSignUp);
router.post("/signin", adminAuth.adminSignIn);
router.post("/signout", userAuthorization, adminAuth.adminSignOut);

// ---
router.get("/customers", userAuthorization, shopItemController.fetchCustomers);
router.get("/orders", userAuthorization, shopItemController.fetchOrders);
router.post("/new-admin", userAuthorization, shopItemController.createAdmin);
// ---
router.post("/add", userAuthorization, shopItemController.addItem);
router.put("/update/:id", userAuthorization, shopItemController.updateItem);
router.delete("/delete/:id", userAuthorization, shopItemController.deleteItem);
router.get("/search", userAuthorization, shopItemController.searchItem);

module.exports = router;
