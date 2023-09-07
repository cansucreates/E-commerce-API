const ShopItem = require("../models/shopItems");

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
  addItem,
  updateItem,
  deleteItem,
  searchItem,
};
