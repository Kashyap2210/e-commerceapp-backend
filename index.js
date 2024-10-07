require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Role = require("./models/role.js");
const Order = require("./models/order.js");
const User = require("./models/user.js");
const isLoggedIn = require("./isLoggedIn.js");
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

// const port = 3000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eCommerceApp");
  console.log("Db is created");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

// app.get("/admin/order", isLoggedIn, async (req, res) => {
//   console.log("req recieved in the backend to see all orders");
//   const adminId = req.user.userId;

//   console.log(adminId);

//   //   If JWT token does not exists
//   if (!adminId) {
//     return res.status(401).json({ success: false, message: "Unauthorised" });
//   }

//   try {
//     console.log("Inside Try Block");
//     const adminUser = await User.findById(adminId);
//     console.log(adminUser);
//     if (!adminUser || adminUser.role !== "admin") {
//       return res.status(401).json({ success: false, message: "Forbidden" });
//     }
//     const allOrders = await Order.find();

//     const ordersByUser = {};
//     for (const order of allOrders) {
//       // Find the user for the order
//       const user = await User.findById(order.userId);
//       if (user) {
//         const username = user.username; // Get the username

//         // Initialize if not present
//         if (!ordersByUser[username]) {
//           ordersByUser[username] = [];
//         }

//         // Add order details to the user's order list
//         ordersByUser[username].push({
//           order_id: order._id,
//           product_name: order.product_name,
//           product_price: order.product_price,
//           quantity: order.product_quantity,
//           status: order.status, // You should already have a status field in the order
//         });
//       }
//     }

//     // Send the structured response
//     return res.status(200).json(ordersByUser);
//   } catch (error) {}
// });

// app.put("/admin/order/:orderId", isLoggedIn, async (req, res) => {
//   const adminId = req.user.userId;
//   const orderIdForStatusChange = req.params.orderId;
//   const { status } = req.body;

//   //   If JWT token does not exists
//   if (!adminId) {
//     return res.status(401).json({ success: false, message: "Unauthorised" });
//   }

//   const adminUser = await User.findById(adminId);
//   if (!adminUser || adminUser.role !== "admin") {
//     return res.status(401).json({ success: false, message: "Forbidden" });
//   }

//   const validStatuses = ["new", "shipped", "fulfilled"];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: `Order status ${status} is invalid`,
//     });
//   }

//   try {
//     const orderForStatusChange = await Order.findById(orderIdForStatusChange);
//     if (!orderForStatusChange) {
//       return res.status(404).json({
//         success: false,
//         message: `Order ${orderIdForStatusChange} not found`,
//       });
//     }
//     orderForStatusChange.status = status;
//     await orderForStatusChange.save();
//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// app.get("/admin/orders/summary", isLoggedIn, async (req, res) => {
//   const adminId = req.user.userId;

//   // Check if JWT token exists
//   if (!adminId) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   // Verify that the user is an admin
//   const adminUser = await User.findById(adminId);
//   if (!adminUser || adminUser.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Forbidden" });
//   }

//   try {
//     // Fetch all orders and users in parallel
//     const allOrders = await Order.find();
//     const allUsers = await User.find().select("_id username");

//     // Initialize order summary for each user
//     const orderSummary = {};
//     allUsers.forEach((user) => {
//       orderSummary[user.username] = 0;
//     });

//     // Calculate total order amount for each user
//     for (const order of allOrders) {
//       const user = allUsers.find((u) => u._id.equals(order.userId));
//       if (user) {
//         orderSummary[user.username] +=
//           order.product_price * order.product_quantity;
//       }
//     }

//     // Send the structured response
//     return res.status(200).json(orderSummary);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// });

app.listen(3000, () => {
  console.log("server is listening");
});
