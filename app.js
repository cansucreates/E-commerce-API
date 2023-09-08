const express = require("express");
const app = express();
const port = 3000;

// adding routes for admin
const adminRoutes = require("./src/routes/admin");
const connectToMongo = require("./db");

connectToMongo();

app.use(express.json());
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
