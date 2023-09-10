const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get('/items', customerController.getAllItems);
router.get('/items/:itemId', customerController.getSingleItem);
router.get('/filter-items', customerController.filterItems);
router.get('/search-items', customerController.searchItems);
router.post('/cart', customerController.addToCart);
router.post('/checkout', customerController.checkout);

module.exports = router;