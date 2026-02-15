const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    camp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_reliefcamp",
      required: true,
    },
    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_centers",
      required: true,
    },
    request_details: {
      type: String,
      required: true,
    },
    request_reply: {
      type: String,
    },
    disaster_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    request_priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    request_status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("tbl_request", requestSchema);
