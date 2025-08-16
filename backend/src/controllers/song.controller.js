const songModel = require("../models/song.model")

const getAllSongs = async (req,res,next) =>{
    try {
        const songs = await songModel.find({}).sort({year:-1});
        if(!songs) return res.status(400).json({message:'No songs found'});
        res.status(200).json({
            message:'All songs fetched',
            songs
        })

    } catch (error) {
        console.error('Error in fetching songs:',error);
        next(error);
    }
}

const getSongById = async (req,res,next)=>{
    try {
        const {songId} = req.params;
        const requestedSong = await songModel.findById(songId);
        if(!requestedSong) return res.status(400).json({message:'Song not found'})
        return res.status(200).json({
            message:'Requested song fetched',
            requestedSong
        })
    } catch (error) {
        console.error('Error in fetching song:',error);
        next(error);
    }
}

const getFeaturedSongs = async(req,res,next)=>{
     try {
        const featuredSongs = await songModel.aggregate([
            {
                $sample:{size:6}
            },
            {
                $project:{
                    _id:1,title:1,artist:1,imageUrl:1,audioUrl:1
                }
            }
        ])
        if(!featuredSongs) return res.status(400).json({message:'No featured songs found'});
        res.status(200).json({
            message:'Featured songs fetched',
            featuredSongs
        });
     } catch (error) {
        console.error('Error in fetching featured songs:',error);
        next(error);
     }
}
const getMadeForYouSongs = async(req,res,next)=>{
    try {
        const madeforyouSongs = await songModel.aggregate([
            {
                $sample:{size:4}
            },
            {
                $project:{
                    _id:1,title:1,artist:1,imageUrl:1,audioUrl:1
                }
            }
        ])
        if(!madeforyouSongs) return res.status(400).json({message:'No Made for you songs found'});
        res.status(200).json({
            message:'Made for you songs fetched',
            madeforyouSongs
        });
     } catch (error) {
        console.error('Error in fetching Made for you songs:',error);
        next(error);
     }
}
const getTrendingSongs = async(req,res,next)=>{
    try {
        const trendingSongs = await songModel.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,title:1,artist:1,imageUrl:1,audioUrl:1
                }
            }
        ])
        if(!trendingSongs) return res.status(400).json({message:'No trending songs fetched'});
        res.status(200).json({
            message:'Trending songs fetched',
            trendingSongs
        })
    } catch (error) {
        next(error);
    }
}
module.exports = {getAllSongs,getSongById,getFeaturedSongs,getMadeForYouSongs,getTrendingSongs};