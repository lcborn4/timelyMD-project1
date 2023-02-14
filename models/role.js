const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  roleName: { type: String },
});

module.exports = mongoose.model("role", roleSchema);
