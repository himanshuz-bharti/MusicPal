const express = require('express');
const { getAllAlbums, getAlbumById } = require('../controllers/album.controller');

const albumRouter = express.Router();
albumRouter.get('/',getAllAlbums);
albumRouter.get('/:albumId',getAlbumById);

module.exports = albumRouter;