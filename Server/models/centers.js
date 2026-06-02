const mongoose = require("mongoose");

const centersSchema = new mongoose.Schema(
  {
    center_name: {
      type: String,
    },
    center_address: {
      type: String,
    },
    center_email: {
      type: String,
      required: true,
      unique: true,
    },
    center_password: {
      type: String,
      required: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_district",
      required: true,
    },
    center_status: {
      type: String,
      enum: ["OPEN", "FULL", "CLOSED"],
      default: "OPEN",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tbl_center", centersSchema);
