const mongoose = require("mongoose");

  const roleSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["user", "admin"], // Only "user" or "admin" are allowed
    },
  });

module.exports = mongoose.model("Role", roleSchema);
