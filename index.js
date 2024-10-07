require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Importing routes
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

// Connect to db
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eCommerceApp");
  console.log("Db is created");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares For Routing
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is listening on ${process.env.PORT}.`);
});
