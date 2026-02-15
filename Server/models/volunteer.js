const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    volunteer_name: {
      type: String,
      required: true,
    },
    volunteer_email: {
      type: String,
      required: true,
    },
    volunteer_password: {
      type: String,
      required: true,
    },
    volunteer_photo: {
      type: String,
    },
    volunteer_proof: {
      type: String,
      // required: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: Boolean,
  enum: [true, false],
  default: true,
}
,
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_district",
    },
    center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_centers",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("tbl_volunteer", volunteerSchema);
