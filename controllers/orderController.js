const orderService = require("../services/orderServices");
const { Role, Status } = require("../utils/constant");

const placeOrder = async (req, res) => {
  console.log("req to place order received in the backend");
  const { product_name, product_price, product_quantity } = req.body;

  // Validate required fields
  if (!product_name || !product_price || !product_quantity) {
    return res.status(400).json({
      success: false,
      message:
        "All fields (product name, product price, product quantity) are required.",
    });
  }

  // Validation Rules for Product
  if (product_name.length < 3 || product_name.length > 10) {
    return res.status(400).json({
      success: false,
      message: "product_name must be between 3 to 10 characters.",
    });
  }

  if (product_price < 100 || product_price > 1000) {
    return res.status(400).json({
      success: false,
      message: "product_price must be between 100 to 1000.",
    });
  }
  if (product_quantity < 1 || product_quantity > 10) {
    return res.status(400).json({
      success: false,
      message: "product_quantity must be between 1 to 10.",
    });
  }

  try {
    const newOrder = await orderService.createOrder(
      req.user.userId,
      product_name,
      product_price,
      product_quantity
    );
    res.status(201).json({
      success: true,
      message: `Order with ${newOrder._id} created successfully`,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Controller to handle retrieving user orders
const getUserOrders = async (req, res) => {
  console.log("request to view orders received in the backend");
  try {
    const userOrders = await orderService.getUserOrders(req.user.userId);
    if (userOrders.length === 0) {
      return res.status(200).json([]);
    }

    const orders = userOrders.map((order) => ({
      order_id: order._id,
      product_name: order.product_name,
      product_price: order.product_price,
      quantity: order.product_quantity,
      status: Status.NEW,
    }));

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
};
