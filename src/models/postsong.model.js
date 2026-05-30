const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    uri:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
})

const postModel=mongoose.model("posts",postSchema)

module.exports=postModel;