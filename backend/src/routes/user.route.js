const express = require('express');
const { get } = require('mongoose');
const { getAllUsers, likedSongs,toggleLikeSong,isLiked } = require('../controllers/user.controller');
const {protectRoute} = require('../middleware/auth.middleware');
const userRouter = express.Router();

userRouter.get('/',protectRoute,getAllUsers);
userRouter.get('/likedSongs',protectRoute,likedSongs);
userRouter.post('/togglelikeSong/:songId',protectRoute,toggleLikeSong);
userRouter.get('/isLiked/:songId',protectRoute,isLiked);
module.exports = userRouter;