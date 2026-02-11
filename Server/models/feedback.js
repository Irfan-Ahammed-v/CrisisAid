const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        feedback_content:{
            type:String,
            required:true
        },
        volunteer_id:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        }
    },
    {
        timestamps:true 
    }
)

module.exports = mongoose.model("tbl_feedback",feedbackSchema)