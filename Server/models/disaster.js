const mongoose = require("mongoose");

const disasterSchema = new mongoose.Schema(
  {
    disaster_details: {
      type: String,
      required: true,
    },

    disaster_photo: {
      type: String,
      required: true,
    },

    disaster_status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_center",
      required: true,
      index: true,
    },

    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_district",
      required: true,
    },

    reliefcamp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_reliefcamp",
      required: true,
    },

    place_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_Place",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Important index for dashboard speed
disasterSchema.index({ center_id: 1, disaster_status: 1 });

module.exports = mongoose.model("tbl_disaster", disasterSchema);
