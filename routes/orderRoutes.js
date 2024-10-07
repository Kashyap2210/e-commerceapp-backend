const express = require("express");
const router = express.Router({ mergeParams: true });
const orderController = require("../controllers/orderController.js");
const isLoggedIn = require("../isLoggedIn.js");

router.post("/", isLoggedIn, orderController.placeOrder);
router.get("/", isLoggedIn, orderController.getUserOrders);

module.exports = router;
