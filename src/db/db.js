const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("Database Connected Successfully")
    }
    catch(err){
        console.log(err)
    }
}

module.exports=connectDB;