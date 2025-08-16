const express = require('express');
const { getAllSongs, getSongById, getFeaturedSongs,getMadeForYouSongs,getTrendingSongs } = require('../controllers/song.controller');
const { protectRoute, requireadmin } = require('../middleware/auth.middleware');

const songRouter = express.Router();
songRouter.get('/',protectRoute,requireadmin,getAllSongs);
songRouter.get('/featured',getFeaturedSongs);
songRouter.get('/made-for-you',getMadeForYouSongs);
songRouter.get('/trending',getTrendingSongs);


module.exports = songRouter;