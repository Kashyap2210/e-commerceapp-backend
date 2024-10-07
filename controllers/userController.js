require("dotenv").config();
const bcrypt = require("bcryptjs");
const userService = require("../services/userServices");
const { Role } = require("../utils/constant");

module.exports.role = async (req, res) => {
  console.log("Request received in the backend for role");

  const { name } = req.body;

  // Validate role name
  console.log([Role.USER, Role.ADMIN]);
  if (![Role.USER, Role.ADMIN].includes(name)) {
    return res.status(400).json({
      success: false,
      message: `Role ${name} is invalid`,
    });
  }

  try {
    // Call the service function
    const result = await userService.createRole(name);

    // Check for success or error messages returned by the service
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.signup = async (req, res) => {
  const { username, password, role } = req.body;

  // Basic request validation
  if (!username || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "All parameters (username, password, role) are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: "false",
      message: "Password should be more than 8 Characters",
    });
  }

  if (password.length > 15) {
    return res.status(400).json({
      success: "false",
      message: "Password should be less than 15 Characters",
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  try {
    // Call the service function
    const result = await userService.userSignUp({ username, password, role });

    // Check for service response and send appropriate HTTP response
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.login = async (req, res) => {
  console.log("Login request received in the backend");

  const { username, password } = req.body;

  // Basic request validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username/Password is required",
    });
  }

  try {
    // Call the service function
    const result = await userService.loginUser(username, password);

    // Check if login was successful or if there was an error message
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Successful login response with token
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
