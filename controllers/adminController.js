const adminService = require("../services/adminServices");
const User = require("../models/user"); // Import the User model
const { Role, Status } = require("../utils/constant");

const getAllOrdersForAdmin = async (req, res) => {
  console.log("req received in the backend to see all orders");
  const adminId = req.user.userId;
  console.log(adminId);

  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const ordersByUser = await adminService.getAllOrdersForAdmin(adminId);
    return res.status(200).json(ordersByUser);
  } catch (error) {
    console.error(error);
    return res.status(403).json({ success: false, message: error.message }); // Forbid when admin check fails
  }
};

const updateOrderStatus = async (req, res) => {
  const adminId = req.user.userId;
  const orderIdForStatusChange = req.params.orderId;
  const { status } = req.body;

  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const validStatuses = [Status.NEW, Status.SHIPPED, Status.FULFILLED];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Order status ${status} is invalid`,
    });
  }

  try {
    await adminService.updateOrderStatus(
      adminId,
      orderIdForStatusChange,
      status
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOrderSummary = async (req, res) => {
  const adminId = req.user.userId;

  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Verify that the user is an admin
  const adminUser = await User.findById(adminId);
  console.log(adminId);
  if (!adminUser || adminUser.role !== Role.ADMIN) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const orderSummary = await adminService.getOrderSummary();
    return res.status(200).json(orderSummary);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllOrdersForAdmin,
  updateOrderStatus,
  getOrderSummary,
};
