const mongoose = require("mongoose");

const volunteercallSchema = new mongoose.Schema(
  {
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_volunteer",
      required: true,
    },

    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_centers",
    },

    disaster_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_disaster",
      required: true,
    },

    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_request",
      required: true,
    },

    task_status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
    },

    remarks: {
      type: String,
    },

    proof_image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("tbl_volunteercall", volunteercallSchema);
