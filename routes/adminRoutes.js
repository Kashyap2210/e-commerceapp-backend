require("dotenv").config();

const express = require("express");
const router = express.Router({ mergeParams: true });
const adminController = require("../controllers/adminController");
const isLoggedIn = require("../isLoggedIn.js");

router.get("/orders", isLoggedIn, adminController.getAllOrdersForAdmin);
router.put("/order/:orderId", isLoggedIn, adminController.updateOrderStatus);
router.get("/orders/summary", isLoggedIn, adminController.getOrderSummary);

module.exports = router;
