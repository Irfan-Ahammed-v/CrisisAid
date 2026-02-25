const mongoose = require('mongoose');

const disasterTypeSchema = new mongoose.Schema(
    {
        disaster_type_name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('tbl_disaster_type', disasterTypeSchema)