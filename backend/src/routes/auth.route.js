const express = require('express');
const { authController } = require('../controllers/auth.controller.js');
const authRouter = express.Router();

authRouter.post('/callback',authController)
module.exports = authRouter;