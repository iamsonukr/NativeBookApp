import userModel from "../model/user.model.js";


const authRoute=async(req,res, next)=>{
    try {
        // get token
        const token=req.header("Authorization").replace("Bearer", "")
        if(!token) return res.status(401).send('Access denied. No token provided');

        // verify token
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        
        // find user
        const user=await userModel.findById(decoded._id).select("-password");
        if(!user) return res.status(400).json({status:"failed", message:"Token is not valid"});

        // append the user to the req
        req.user=user
        next()
    } catch (error) {
        console.log(error)
        res.status(400).send('Invalid token')        
    }
}

export default authRoute