import mongoose from 'mongoose'

export const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected ${connect.connection.host}`)
    } catch (error) {
        console.log("Error connecting database ")
        process.exit(1)
        
    }
}