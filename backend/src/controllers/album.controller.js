const albumModel = require('../models/album.model.js')
const getAllAlbums = async (req,res) =>{
    try {
        const albums = await albumModel.find({});
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
}
module.exports = {getAllAlbums,getAlbumById};