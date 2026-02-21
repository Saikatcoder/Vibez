import dotenv from "dotenv";
dotenv.config();


import mongoose from 'mongoose';
mongoose.connect(process.env.DB as string)

import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRouter from "./router/auth.routes";


const app = express();
app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 8080}`);

})

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