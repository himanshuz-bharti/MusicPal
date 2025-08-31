const userModel = require('../models/user.model.js')
const getAllUsers = async (req,res)=>{
    try {
        const currentUserId = req.auth().userId;
        const users = await userModel.find({clerkId:{$ne:currentUserId}});
        if(!users) return res.status(400).json({message:'No users found'});
        res.status(200).json({
            message:'All users fetched',
            users
        });
    } catch (error) {
        console.error('Error in fetching users:',error);
        next(error);
    }
}

const likedSongs = async(req,res)=>{
    try {
        const {userId} =req.auth();
        const curruser = await userModel.findOne({clerkId:userId}).populate('likedSongs');
        if(!curruser) return res.status(400).json({message:'User not found'});
        const likedSongs = curruser.likedSongs;
        res.status(200).json({
            message:'Liked Songs fetched',
            likedSongs
        })
    } catch (error) {
        console.error('Error in fetching liked songs:',error);
        next(error);
    }
}

const toggleLikeSong = async(req,res)=>{
    try {
        const {songId} = req.params;
        const {userId} = req.auth();
        const user = await userModel.findOne({clerkId:userId});
        const isLiked = user.likedSongs.includes(songId);
        if(isLiked){
            user.likedSongs = user.likedSongs.filter(id=>id.toString()!==songId);
            await user.save();
        }
        else{
            user.likedSongs.push(songId);
            await user.save();
        }
        const newuser = await userModel.findOne({clerkId:userId}).populate('likedSongs');
        res.status(200).json({
            message:'Songs toggled successfully',
            liked:!isLiked,
            likedSongs:newuser.likedSongs,
        })
    } catch (error) {
        console.error('Error in toggling liked song:',error);
        next(error);
    }
}
const isLiked = async(req,res)=>{
    try {
        const {songId} = req.params;
         if(!songId) return res.status(400).json({message:'SongID is needed'})
        const {userId} = req.auth();
        const user = await userModel.findOne({clerkId:userId})
        if(!user) return res.status(400).json({message:'User not found'});
        const likedStatus = user.likedSongs.includes(songId);
        res.status(200).json({
            message:'Liked Status fetched',
            isLiked:likedStatus,
        })
    } catch (error) {
        console.error('Error in fetching liked status:',error);
        next(error);
    }
}
module.exports = {getAllUsers, likedSongs,toggleLikeSong,isLiked};