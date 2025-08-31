const express = require('express');
const { getAllAlbums, getAlbumById,createAlbum,addSongToAlbum,removeSongFromAlbum,deleteAlbum } = require('../controllers/album.controller');
const { protectRoute } = require('../middleware/auth.middleware');
const albumRouter = express.Router();
albumRouter.get('/',getAllAlbums);
albumRouter.get('/:albumId',getAlbumById);
albumRouter.post('/createAlbum',protectRoute,createAlbum);
albumRouter.post('/addSongToAlbum',protectRoute,addSongToAlbum);
albumRouter.post('/removeSongFromAlbum',protectRoute,removeSongFromAlbum);
albumRouter.delete('/:albumId',protectRoute,deleteAlbum);

module.exports = albumRouter;