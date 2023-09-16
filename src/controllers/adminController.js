const ShopItem = require("../models/shopItems");
const Order = require("../models/order");
const Customer = require("../models/customer");
const bcrypt = require("bcrypt");

// fetch all the orders
const fetchOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetch all customers
const fetchCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ isAdmin: false }, "-password"); // exclude password field and admins

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// create a new admin account
const createAdmin = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // if the admin already exists with the provided email
    const adminExists = await Customer.findOne({ email });

    if (adminExists) {
      return res
        .status(400)
        .json({ error: "Admin already exists with this email" });
    }

    // a new admin user
    const newAdmin = new Customer({
      userName,
      email,
      password,
      isAdmin: true, // isAdmin field to true for the new admin
    });

    // hash the password
    const saltRounds = 10;
    newAdmin.password = bcrypt.hashSync(password, saltRounds);

    await newAdmin.save();

    res.status(201).json({ message: "New admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// adding Item
const addItem = async (req, res) => {
  try {
    // getting data from the request body
    const { title, image, price, description, availableCount, genre } =
      req.body;

    // creating a new ShopItem instance
    const newItem = new ShopItem({
      title,
      image,
      price,
      description,
      availableCount,
      genre,
    });

    // saving the new item to the db
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// updating item
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // findin the item by its ID
    const itemToUpdate = await ShopItem.findById(itemId);

    if (!itemToUpdate) {
      return res.status(404).json({ error: "Item not found " });
    }

    // updating the item properties

    itemToUpdate.title = req.body.title || itemToUpdate.title;
    itemToUpdate.image = req.body.image || itemToUpdate.image;
    itemToUpdate.price = req.body.price || itemToUpdate.price;
    itemToUpdate.description = req.body.description || itemToUpdate.description;
    itemToUpdate.availableCount =
      req.body.availableCount || itemToUpdate.availableCount;
    itemToUpdate.genre = req.body.genre || itemToUpdate.genre;

    const updatedItem = await itemToUpdate.save();

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// deleting Item
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const deletedItem = await ShopItem.findByIdAndRemove(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// searching items

const searchItem = async (req, res) => {
  try {
    const { title, genre } = req.query;

    const query = {};

    if (title) {
      query.title = title;
    }

    if (genre) {
      query.genre = genre;
    }

    // using the query obj to find matching items
    const items = await ShopItem.find(query);

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchOrders,
  fetchCustomers,
  createAdmin,
  addItem,
  updateItem,
  deleteItem,
  searchItem,
};
