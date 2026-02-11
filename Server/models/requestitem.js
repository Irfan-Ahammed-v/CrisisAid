const mongoose = require("mongoose");

const requestitemSchema = new mongoose.Schema(
{
    requestitem_name:{
        type:String,
        required:true
    },
    requestitem_qty:{
        type:Number,
    },
    request_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tbl_request",
        required:true
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model("tbl_requestitems",requestitemSchema)