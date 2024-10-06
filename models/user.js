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
    minlength: 8,
    maxlength: 15,
    validate: {
      validator: function (value) {
        // Regex to check at least one uppercase, one lowercase, and one number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/.test(value);
      },
      message:
        "Password must be 8-15 characters, with at least one uppercase letter, one lowercase letter, and one number",
    },
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
