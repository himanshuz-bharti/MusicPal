const {clerkClient} = require('@clerk/express');
require('dotenv').config();
const protectRoute = async (req,res,next)=>{
    try {
        const {userId} = req.auth();
        if(!userId){
            return res.status(401).json({
                message:'Unauthorized-User must be logged in',
            })
        }
        next();
    } catch (error) {
        console.error('Error in protectRoute middleware:',error);
        next(error);
    }
}

const requireadmin = async (req,res,next)=>{
    try {
        const {userId} = req.auth();
        const admin = await clerkClient.users.getUser(userId);
        const isAdmin = process.env.ADMIN_EMAIL === admin.primaryEmailAddress?.emailAddress;
        if(!isAdmin){
            return res.status(401).json({
                message:'Unauthorized-User must be an admin',
            })
        }
        next();
    } catch (error) {
        console.log("error in requiredmin middleware:",error);
        next(error);
    }
}
module.exports={protectRoute,requireadmin};