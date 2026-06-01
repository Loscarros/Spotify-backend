const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required:true
    },
    usertype: {
        type:String,
        enum:['user','artist'], //only two value possible so enum is used
        default:'user'
    },
    verified:{
        type:Boolean,
        reqired:true,
        default:false
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel;