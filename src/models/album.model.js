const mongoose=require('mongoose')

const albumSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    music:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts"
    }],
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
})

const albumModel=mongoose.model("album",albumSchema)

module.exports=albumModel;