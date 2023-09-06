const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// adding routes for admin
const adminRoutes = require("./src/routes/admin");
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log("Server is running on port ${port}");
});
