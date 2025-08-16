const express = require('express');
const songModel = require('../models/song.model');
const UserModel = require('../models/user.model');
const albumModel = require('../models/album.model');
const { getAllStat } = require('../controllers/stat.controller');
const { protectRoute, requireadmin } = require('../middleware/auth.middleware');

const statRouter = express.Router();
statRouter.get('/', protectRoute,requireadmin,getAllStat);