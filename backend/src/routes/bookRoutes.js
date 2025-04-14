import express from 'express'
import cloudinary from '../lib/cloudinary.js'
import BookModel from '../model/book.model.js'
import authRoute from '../middleware/auth.middleware.js'

const router=express.Router()

router.post('/create', authRoute, async(req,res)=>{
    try {
        const {title, caption, rating, image}=req.body
        if(!image || !title || !caption || !rating){
            return res.status(400).json({status:"failed", message:" Please provide all fields."})
        }

        const uploadResponse=await cloudinary.uploader.upload(image)
        const newImage=uploadResponse.secure_url

        const newBook = new BookModel.create({
            title,
            caption,
            rating,
            image:newImage,
            user:req.user._id

        })

        const bookCreated={
            title:newBook.title,
            caption:newBook.caption,
            rating:newBook.rating,
            image:newBook.image,
            user:req.user._id
        }
        
        return res.status(200).json({status:"success", message:"Post created successfully", data:bookCreated})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:"failed", message:"Internal server error"})
    };
})

router.get('/all-books', authRoute, async(req,res)=>{
    try {
        const page=req.query.page || 1;
        const limit=req.query.limit || 5;
        const skip=(page-1)*limit;

        const books=await BookModel.find()
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("users", "username profileImage")

        const totalBooks=await BookModel.countDocuments()

        const pageination={
            currentPage:page,
            totalPage:Math.ceil(totalBooks/limit)
        }
    
        return res.status(200)
        .json({status:"success", message:"All books", data:books, pagination:pageination})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status:"failed", message:"Internal server error"})
    }
})

router.delete('/remove/:bookId', authRoute, async(req,res)=>{
    const {bookId}= req.params;
    try{
        if(!bookId)return res.status(400).json("Please provide the book Id");
        
        const book=await BookModel.findById(bookId);
        if(!book)return res.status(404).json("Book not found");

        if(book.user.toString() !== req.user._id)return res.status(403).json("You are not authorized to delete this book");

        await book.deleteOne()

        res.status(200).json({message:"Book deleted successfully."})
    }catch{
        return res.status(500).json({status:"failed", message:"Internal server error"})
    }
})

export default router