import mongoose from "mongoose";

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
},{timestamps:true})

const BookModel=mongoose.model("books", bookSchema)
export default BookModel