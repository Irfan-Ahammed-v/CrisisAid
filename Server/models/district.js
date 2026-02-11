const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  districtName: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model("tbl_district", districtSchema);
