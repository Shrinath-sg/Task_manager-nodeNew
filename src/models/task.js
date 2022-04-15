const mongoose = require('mongoose')
const Task = mongoose.model("Task",{
    description: {type: String,trim: true,required: true},
    isCompleted: {type: Boolean,default: false},
    owner: {type: mongoose.Schema.Types.ObjectId,require: true,ref: "User"}
});
module.exports = Task;
