const express = require("express");
const router = express.Router();
const shopItemController = require("../controllers/adminController");

router.post("/add", shopItemController.addItem);
router.put("/update/:id", shopItemController.updateItem);
router.delete("/delete/:id", shopItemController.deleteItem);
router.get("/search", shopItemController.searchItem);

module.exports = router;
