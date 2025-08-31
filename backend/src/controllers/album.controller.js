const albumModel = require('../models/album.model.js');
const songModel = require('../models/song.model.js');
const cloudinary = require('../config/cloudinary.js');

const uploadTocloudinary = async (file)=>{
    try {
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type:'auto'
        })
        return uploadedFile.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
    }
}
const getAllAlbums = async (req,res) =>{
    try {
        const albums = await albumModel.find({}).populate('songs');
        if(!albums ) return res.status(400).json({message:'No albums found'});
        res.status(200).json({
            message:'All Albums fetched',
            albums
        })
    } catch (error) {
        console.error('Error in fetching albums:',error);
        next(error);
    }
}

const getAlbumById = async (req,res)=>{
    try {
       const {albumId} = req.params;
       const requestedAlbum = await albumModel.findById(albumId).populate('songs');
       if(!requestedAlbum) return res.status(400).json({message:'Album not found'});
       res.status(200).json({
        message:'Requested Album fetched',
        requestedAlbum
       })
    } catch (error) {
        console.error('Error in fetching album:',error);
        next(error);
    }
};

const createAlbum = async(req,res,next)=>{
    const {albumName,songId} = req.body;
    const {imageFile} = req.files;
    try {
       const song = await songModel.findById(songId);
       const imageUrl = await uploadTocloudinary(imageFile);
       const newAlbum = new albumModel({name:albumName,imageUrl,songs:[song]});
       await newAlbum.save();
       const albums = await albumModel.find({}).populate('songs');
       res.status(200).json({
        message:'Album created succesfully',
        albums:albums,
       })
    } catch (error) {
        console.error('Error in creating album:',error);
        next(error);
    }

};

const deleteAlbum = async(req,res,next)=>{
    const {albumId} = req.params;
    if(!albumId) return res.status(400).json({message:'AlbumID is required'});
    try {
        const del = await albumModel.findByIdAndDelete(albumId);
        const albums = await albumModel.find({}).populate('songs');
        res.status(200).json({
            message:'Album successfully deleted',
            albums:albums,
        })
    } catch (error) {
        console.error('Error in deleting album:',error);
        next(error);
    }
}
const addSongToAlbum =async(req,res,next)=>{
   const {songId,albumId}=req.body;
   if(!songId || !albumId) return res.status(400).json({message:'Song ID and album ID are needed'});
   try {
    const currAlbum = await albumModel.findById(albumId);
    if(!currAlbum) return res.status(400).json({message:'Album not found'});
    currAlbum.songs.push(songId);
    await currAlbum.save();
    const allAlbums = await albumModel.find({});
    res.status(200).json({
        message:'Song added to album succesfully',
        albums: allAlbums
    });
   } catch (error) {
    console.error('Error in adding song:',error);
    next(error);
   }
};

const removeSongFromAlbum = async(req,res,next)=>{
    try {
        const {songId,albumId}=req.body;
        if(!songId || !albumId) return res.status(400).json({message:'SongID and AlbumID are required'});
        const currAlbum = await albumModel.findById(albumId);
        const ispresent = currAlbum.songs.includes(songId);
        if(!ispresent) return res.status(400).json({message:'Song is not present in this album'});
        const newsongs = currAlbum.songs.filter((song)=>song._id!=songId);
        currAlbum.songs = newsongs;
        await currAlbum.save();
        const updatedAlbum = await albumModel.findById(albumId).populate('songs');
        return res.status(200).json({
            message:'Song is successfully removed from the album',
            album:updatedAlbum,
        })
    } catch (error) {
        console.error('Error in removing song:',error);
        next(error);
    }

}
module.exports = {getAllAlbums,getAlbumById,createAlbum,addSongToAlbum,removeSongFromAlbum,deleteAlbum};