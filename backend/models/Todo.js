const mongoose = require("mongoose");

// Schema
const todoSchema = new mongoose.Schema({
  desc: String,
  isDone: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

// Model
module.exports = mongoose.model("Todo", todoSchema);
