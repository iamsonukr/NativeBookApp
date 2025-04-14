import express from 'express'
import "dotenv/config"
import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import { connectDB } from './lib/db.js'
const app=express()
const PORT=process.env.PORT
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/book',bookRoutes)

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}` )
    connectDB()
})