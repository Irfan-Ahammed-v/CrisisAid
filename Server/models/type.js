const mongoose = require("mongoose");
const typeschema = new mongoose.Schema({
  type_name: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});
module.exports = mongoose.model("tbl_type", typeschema);