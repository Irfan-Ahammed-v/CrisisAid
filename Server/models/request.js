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
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
    request_status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "assigned"],
      default: "pending",
    },
    estimated_people_affected: {
      type: Number,
      default: 0,
    },
    assigned_volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_volunteer",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("tbl_request", requestSchema);
