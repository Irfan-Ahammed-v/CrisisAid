const mongoose = require("mongoose");

const itemschema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  unit: {
    type: String,
    required: true,
    enum: ["kg", "liters", "pieces", "boxes", "packs", "sets", "units"]
  },

  category: {
    type: String,
    required: true,
    enum: ["food", "medical", "shelter", "hygiene", "equipment", "other"]
  },

  is_active: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
});

module.exports = mongoose.model("tbl_item", itemschema);
