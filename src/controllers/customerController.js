const Customer = require("../models/customer");
const ShopItem = require("../models/shopItems");
const Order = require("../models/order");
const Cart = require("../models/cart");
const mongoose = require("mongoose");

// getting all the shop items

const getAllItems = async (req, res) => {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error " });
  }
};

// getting a single item by its ID
const getSingleItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await ShopItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// filtering items based on genre and price range

const filterItems = async (req, res) => {
  const { genre, minPrice, maxPrice } = req.query;

  try {
    let query = {};

    if (genre) {
      query.genre = genre;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    } else if (minPrice !== undefined) {
      query.price = { $gte: parseFloat(minPrice) };
    } else if (maxPrice !== undefined) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    const filteredItems = await ShopItem.find(query);

    if (filteredItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found matching the criteria." });
    }

    return res.json(filteredItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// searching items
const searchItems = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Query parameter 'query' is missing." });
    }

    const searchResults = await ShopItem.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// adding item to the cart
const addToCart = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const itemId = req.body.itemId;
    const quantity = req.body.quantity;

    // verify customer
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // find the item and check if it exists
    const item = await ShopItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // check if item is available
    if (item.availableCount < quantity) {
      return res.status(400).json({ error: "Not enough items in stock" });
    }

    // creatin a cart item and adding it to the customers cart
    const cartItem = new Cart({
      customer_id: customerId,
      item_id: itemId,
      quantity: quantity,
    });

    customer.cart.push(cartItem);

    // updating the available count in the shop items inventory
    item.availableCount -= quantity;

    await customer.save();
    await item.save();
    await cartItem.save();

    res.json(customer.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// check out and creating an order
const checkout = async (req, res) => {
  try {
    // validating customer ID
    if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    const customerId = req.body.customerId;

    // finding customer
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // fetching cart items
    const cartItems = await Cart.find({
      customer_id: customerId,
      status: "active",
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // calculating total
    let billTotal = 0;

    for (const cartItem of cartItems) {
      // validating the item ID
      if (!mongoose.Types.ObjectId.isValid(cartItem.item_id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const itemId = cartItem.item_id;

      // get item
      const item = await ShopItem.findById(itemId);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      billTotal += item.price * cartItem.quantity;
    }

    // creating order items array
    const orderItems = [];

    for (const cartItem of cartItems) {
      // creating order item object
      const orderItem = {
        cart_item_id: cartItem._id,
        quantity: cartItem.quantity,
      };

      orderItems.push(orderItem);
    }

    // creating order
    const order = new Order({
      customer_id: customerId,
      items: orderItems,
      total: billTotal,
    });

    // clearing cart here
    await Cart.deleteMany({ customer_id: customerId });

    // saving the order
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetching orders

const fetchOrders = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const orders = await Order.find({ customer_id: customerId })
      .populate("items.cart_item_id")
      .populate("customer_id");

    if (!orders) {
      return res.status(400).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetching their profile

const getProfile = async (req, res) => {
  try {
    const customerId = req.customerId;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// updating their profile

const updateProfile = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { userName, address, phoneNumber } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        userName,
        address,
        phoneNumber,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// updating their cart item quantity
/* const updateCartItem = async (req, res) => {
  try {
    const customerId = req.customerId;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    // Find cart item
    const cartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    ).populate("item_id");

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const itemId = cartItem.item_id._id;

    // Fetch the corresponding ShopItem
    const item = await ShopItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Calculate the difference in quantity and update availableCount
    const quantityDifference = quantity - cartItem.quantity;
    item.availableCount -= quantityDifference;

    console.log("quantity:", quantity);
    console.log("item.availableCount:", item.availableCount);
    console.log("quantityDifference:", quantityDifference);

    // Check if item is available
    if (item.availableCount < 0) {
      return res.status(400).json({ error: "Not enough items in stock" });
    }

    // Save the updated ShopItem
    const updatedItem = await item.save();

    // Fetch the updated customer cart
    const customer = await Customer.findById(customerId).populate("cart");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Ensure the cart is populated correctly
    if (!customer.cart) {
      console.log("Customer cart is not found:", customer);
      return res.status(404).json({ error: "Cart not found" });
    }

    // Update the cart item's quantity if needed
    const updatedCartItem = customer.cart.items.find(
      (item) => item._id.toString() === cartItemId
    );

    if (!updatedCartItem) {
      console.log("Cart item not found in the customer's cart:", cartItemId);
      return res
        .status(404)
        .json({ error: "Cart item not found in the customer's cart" });
    }

    updatedCartItem.quantity = quantity;

    await customer.save();

    res.json(customer.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
*/

// deleting cart item

const deleteCartItem = async (req, res) => {
  try {
    const customerId = req.customerId;
    const cartItemId = req.params.id;

    // find the item and delete

    const cartItem = await Cart.findByIdAndRemove(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // fetching the updated customer cart

    const customer = await Customer.findById(customerId).populate("cart");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllItems,
  getSingleItem,
  filterItems,
  searchItems,
  addToCart,
  checkout,
  fetchOrders,
  getProfile,
  updateProfile,
  // updateCartItem,
  deleteCartItem,
};
