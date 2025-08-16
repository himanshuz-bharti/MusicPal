const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    likedSongs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Song'
    }]
},{timestamps:true})

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;