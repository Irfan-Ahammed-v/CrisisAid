const mongoose = require("mongoose");
const place = require("./place");

const disasterSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("tbl_disaster", disasterSchema);
