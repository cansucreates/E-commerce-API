const mongoose = require("mongoose");

// MongoDB Atlas connection string
const url =
  "mongodb+srv://newfirebaseacc:mongosifresi@cluster0.5theczz.mongodb.net/";

const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("Database connected: ", url);
  });

  db.on("error", (err) => {
    console.error("Database connection error: ", err);
  });
};

module.exports = connectToMongo;
