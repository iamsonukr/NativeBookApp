import userModel from "../model/user.model.js";
import jwt from 'jsonwebtoken'


const authRoute=async(req,res, next)=>{
    try {
        // get token
      
        const token=req.header("Authorization").replace("Bearer", "").trim()
        if(!token) return res.status(401).send('Access denied. No token provided');

        // verify token
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        console.log(decoded)
        
        // find user
        const user=await userModel.findById(decoded.userId).select("-password");
        if(!user) return res.status(400).json({status:"failed", message:"Token is not valid"});

        // append the user to the req
        req.user=user
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({message:'Internal Server error'})        
    }
}

export default authRoute