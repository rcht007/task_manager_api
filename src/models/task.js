
const mongoose=require('mongoose')


const taskSchema=new mongoose.Schema( {
    description: {
        type: String,
        required:true,
        trim:true
    },
    completed: {
        type: Boolean,
        default:false
    },
    Owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    }
},{timestamps:true})

const Task = mongoose.model('Task',taskSchema)
//without explicitly providing sxchema dont use time stamp
module.exports=Task;