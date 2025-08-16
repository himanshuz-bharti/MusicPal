const express = require('express');
const { protectRoute, requireadmin } = require('../middleware/auth.middleware');
const { createSong,deleteSong, createAlbum, deleteAlbum, checkAdmin } = require('../controllers/admin.controller');

const adminRouter = express.Router();

adminRouter.use(protectRoute,requireadmin);
adminRouter.get('/check',checkAdmin);
adminRouter.post('/songs',createSong)
adminRouter.delete('/songs/:id',deleteSong);
adminRouter.post('/album',createAlbum)
adminRouter.delete('/album/:id',deleteAlbum);
module.exports = adminRouter;