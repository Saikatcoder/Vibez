import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
mongoose.connect(process.env.DB as string)

import express from 'express';
import { createServer } from "http";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthMiddleware from "./middleware/auth.middleware";
import AuthRouter from "./router/auth.route";
import StorageRouter from "./router/storage.route";
import FriendRouter from "./router/friend.route";
import SwaggerConfig from "./util/swagger";
import { serve, setup } from "swagger-ui-express";
import { Server } from "socket.io";
import StatusSocket from "./socket/status.socket";
import corsConfig from "./util/cors";
import ChatSocket from "./socket/chat.socket";
import ChatRouter from "./router/chat.route";
import VideoSocket from "./socket/video.socket";

const app = express();
const server = createServer(app)

server.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 8080}`)})

// Socket connection
const io = new Server(server,{cors:corsConfig})
StatusSocket(io)
ChatSocket(io)
VideoSocket(io)

// middleware
app.use(cors(corsConfig))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Endpoints
app.use("/api-docs",serve, setup(SwaggerConfig))
app.use("/auth", AuthRouter)
app.use("/storage",AuthMiddleware, StorageRouter)
app.use('/friend', AuthMiddleware, FriendRouter)
app.use("/chat",ChatRouter)
