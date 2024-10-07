const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");

async function createRole(name) {
  // Check if role already exists in the database
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    return { success: false, message: `Role with ${name} is already present.` };
  }

  // Create and save the new role
  const role = new Role({ name });
  await role.save();

  return { success: true, message: "Role created successfully", id: role._id };
}

async function userSignUp({ username, password, role }) {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return {
        success: false,
        message: `Username ${username} is already present`,
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Service Error:", error);
    throw error; // Let the controller handle specific errors, such as validation
  }
}

async function loginUser(username, password) {
  try {
    // Find user by username
    const userToBeLoggedIn = await User.findOne({ username });
    if (!userToBeLoggedIn) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      userToBeLoggedIn.password
    );
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Password is invalid",
      };
    }

    // Generate JWT token
    const payload = { userId: userToBeLoggedIn._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error("Service Error:", error);
    throw error; // The controller will handle unexpected errors
  }
}

module.exports = {
  createRole,
  userSignUp,
  loginUser,
};
