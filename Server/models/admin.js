const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        admin_name: {
            type: String,
            required: true,
        },
        admin_email: {
            type: String,
            required: true,
            unique: true,
        },
        admin_password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("tbl_admin", adminSchema);