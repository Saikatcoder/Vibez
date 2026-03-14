import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
mongoose.connect(process.env.DB as string)

import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'

import AuthMiddleware from "./middleware/auth.middleware";
import AuthRouter from "./router/auth.route";
import StorageRouter from "./router/storage.route";
import FriendRouter from "./router/friend.route";


const app = express();
app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 8080}`)})

app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/auth", AuthRouter)
app.use("/storage",AuthMiddleware, StorageRouter)
app.use('/friend', AuthMiddleware, FriendRouter)