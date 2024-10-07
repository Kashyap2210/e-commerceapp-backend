const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
