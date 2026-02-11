const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  place_name: {
    type: String,
    required: true,
  },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_district",
    required: true,
  }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("tbl_Place", placeSchema);