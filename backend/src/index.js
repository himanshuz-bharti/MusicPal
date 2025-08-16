require('dotenv').config();
const express = require('express');
const { dbConnect } = require('./config/database');
const {clerkMiddleware} = require('@clerk/express');
const fileUpload = require('express-fileupload');
const path = require('path');
const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');
const adminRouter = require('./routes/admin.route.js');
const albumRouter = require('./routes/album.route.js');
const songRouter = require('./routes/song.route.js');
const cors = require('cors');
const port = process.env.PORT;

const app = express(); 

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
    allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
app.use(clerkMiddleware());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:path.join(__dirname,'tmp'),
    createParentPath:true,
    limits: { fileSize: 10 * 1024 * 1024 }, 
}));
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/admin',adminRouter);
app.use('/api/album',albumRouter);
app.use('/api/song',songRouter)
app.use((err,req,res,next)=>{
    res.status(500).json({
        message:process.env.NODE_ENV==='production'?'Internal Server Error':err.message,
    })
})

dbConnect().then(()=>{
    console.log('Database connected successfully');
    app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})
}).catch((error)=>{
    console.log('Database connected failed:',error);
})