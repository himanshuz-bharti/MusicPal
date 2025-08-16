const userModel = require('../models/user.model.js');  
const authController = async (req,res,next)=>{
    try {
        const {id,firstName,lastName,imageUrl} = req.body;
        const update = {
            fullname: `${firstName} ${lastName}`,
            imageUrl,
            clerkId: id
        };
        
        const options = {
            upsert: true,           // Create a new document if no match is found
            new: true,             // Return the updated/created document
            setDefaultsOnInsert: true // Apply schema defaults on insert
        };

        const user = await userModel.findOneAndUpdate({clerkId:id},update,options);
        res.status(200).json({
            message:'User Created'
        })
    } catch (error) {
        console.log("error in auth callback:",error);
        next(error);
    }
}
module.exports = {
    authController
}