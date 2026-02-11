const mongoose = require("mongoose");

const reliefecampSchema = new mongoose.Schema(
  {
    camp_name: {
      type: String,
      required: true,
    },
    camp_details: {
      type: String,
      required: true,
    },
    camp_address: {
      type: String,
      required: true,
    },
    camp_proof: {
      type: String,
    },
    camp_email: {
      type: String,
      required: true,
    },
    camp_password: {
      type: String,
      required: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_district",
    },
    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_centers",
    },
    place: {
      type: String,
    },
    verification_status: {
      type: String,
      enum: ["null","pending", "approved", "rejected"],
      default: "null",
    },
    camp_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    current_occupancy: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("tbl_reliefcamp", reliefecampSchema);
