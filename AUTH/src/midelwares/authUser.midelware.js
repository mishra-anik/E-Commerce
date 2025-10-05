const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const authUser = async (req , res , next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }   
    req.user = user;
    next();
}


module.exports = authUser;