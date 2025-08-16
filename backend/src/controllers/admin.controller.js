const cloudinary = require('../config/cloudinary.js');
const albumModel = require('../models/album.model.js');
const songModel = require('../models/song.model.js');
const {clerkClient} = require('@clerk/express')
require('dotenv').config();

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

const createSong = async (req,res,next) =>{
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({
                message:'Please upload both audio and image files.'
            })
        }
        const {title,artist,duration,albumId,year} = req.body;
        const {imageFile,audioFile} = req.files;
        if(!title || !artist || !duration || !year){
            return res.status(400).json({
                message:'All song fields are required',
            })
        }
        const audioUrl = await uploadTocloudinary(audioFile);
        const imageUrl = await uploadTocloudinary(imageFile);
        const song = new songModel({
            title,
            artist,
            duration,
            albumId:albumId || null,
            year,
            audioUrl,
            imageUrl
        });
        await song.save();
        res.stataus(200).json({
            message:'Song created succesfully',
            song,
        })
    } catch (error) {
        console.error('Error in create song:',error);
        next(error);
    }
}

const deleteSong = async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                message:'Song id is needed',
            })
        }
        const song = await songModel.findById(id);
        if(!song){
            return res.status(400).json({
                message:'Song not found',
            })
        }
        //if song belongs to an album, remove it from album
        if(song.albumId){
            const album = await albumModel.findById(song.albumId);
            if(album){
                const updatedsong = album.songs.filter((s)=>s._id!== id );
                album.songs = updatedsong;
                await album.save();
            }
        }
        await songModel.deleteOne({_id:id});
        res.status(200).json({
            message:'Song deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleting song:',error);
        next(error);
        
    }
}

const createAlbum = async (req,res)=>{
    try {
        const {name,artist,releaseYear} = req.body;
        const {imageFile} = req.files;
        const imageUrl = await uploadTocloudinary(imageFile);
        const album = new albumModel({
            name,artist,releaseYear,imageUrl
        });
        await album.save();
        res.status(200).json({
            message:'Album created succesfully',
            album
        })
    } catch (error) {
        console.error('Error in creating album:',error);
        next(error);
    }
}
const deleteAlbum = async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({
            message:'Album id is needed',
        });
        await songModel.deleteMany({albumId:id});
        const album = await albumModel.findByIdAndDelete(id);
        if(!album) return res.status(400).json({
            message:'Error in deleteing album',
        })
        res.status(200).json({
            message:'Album deleted successfully',
        })
    } catch (error) {
        console.error('Error in deleting album:',error);
        next(error);
        
    }
}

const checkAdmin = async (req,res,next)=>{
    try {
        const {userId} = req.auth();
        const admin = await clerkClient.users.getUser(userId);
        const isAdmin = process.env.ADMIN_EMAIL === admin.primaryEmailAddress?.emailAddress
        res.status(200).json({admin:isAdmin});
    } catch (error) {
        console.error('Error in checkadmin:',error);
        next(error);
    }
}
module.exports = {createSong,deleteSong,createAlbum,deleteAlbum,checkAdmin}