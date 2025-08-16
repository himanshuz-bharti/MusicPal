const songModel = require('../models/song.model');
const UserModel = require('../models/user.model');      
const albumModel = require('../models/album.model');

const getAllStat = async(req,res,next)=>{
    try {
        // const totalSongs = await songModel.countDocuments();
        // const totalUsers = await UserModel.countDocuments();
        // const totalAlbums = await albumModel.countDocuments();
        const [totalSongs,totalUsers,totalAlbums,uniqueArtist] = await Promise.all([
            songModel.countDocuments(),
             UserModel.countDocuments(), 
             albumModel.countDocuments(),
             songModel.aggregate([
                {
                    $unionWith:{
                        coll:'Album',
                        pripeline:[],
                    }
                },
                {
                    $group:{
                        _id:'$artist',
                    }
                },{
                    $count:"count"
                }
            ])
            ]);
            res.status(200).json({
                message:'Statistics fetched succesfully',
                totalSongs,
                totalUsers,
                totalAlbums,
                totalArtist:uniqueArtist[0]?.count || 0,
            })
    } catch (error) {
        next(error);
    }
}

module.exports = {getAllStat};