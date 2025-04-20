import express from 'express'
import userModel from '../model/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router=express.Router()

const generateToken=(userId)=>{
    return jwt.sign({userId:userId},process.env.SECRET_KEY,{expiresIn:'1d'})
}

router.post("/register",async(req,res)=>{
    try {
        const {email, password, username}=req.body
        console.log("Received")
        if(!email || !password || !username){
            return res.status(400).json({message:"Please fill in all fields."})
        }
        if(password.length< 8){
            return res.status(400).json({message:"Password must be at least 8 characters."})
        }

        if(username.length<3){
            return res.status(400).json({message:"Password must be at least 8 characters."})
        }

        const alreayExist=await userModel.findOne({$or:[{email}, {username}]})
        if(alreayExist)return res.status(400).json({message:"User already exist."});

        const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

        const newUser={
            email,
            password,
            username,
            profileImage,
        }
        
        const user=await userModel.create(newUser);

        const token= generateToken(user._id)
        // Convert from mongoDB document to plain object before deleting
        const userObject = user.toObject();
        delete userObject.password
        console.log(userObject)

        return res.status(201).json({message:"User created successfully",data:user, token:token});
                
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:"failed", message:error.message || "Internsal Server error."})
        
    }
})

router.post("/login",async(req,res)=>{
   try {
    const {email,password}=req.body

    if(!email || !password){
        return res.status(400).json({status:"failed" ,message:"Please provide all the fields."})
    }
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({status:"failed" ,message:"Invalid credentials."})
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({status:"failed" ,message:"Invalid credentials."})
    }

    const modUser=user.toObject()
    delete modUser.password
    delete modUser._id
    delete modUser.__v

    const token=generateToken(user._id)

    return res.status(200).json({status:"success", message:"User logged in successfully.", data:modUser, token:token})

   } catch (error) {
    console.log(error)
    return res.status(500).json({status:"failed", message:error.message || "Internsal Server error."})
    
   }
})

export default router