const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    artist:{
        type:String,
    },
    releaseYear:{
        type:Number,
    },
    songs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Song',
    }],
},{timestamps:true})

const albumModel = mongoose.model('Album',albumSchema);
module.exports = albumModel;