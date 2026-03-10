import { NextFunction, Request, Response } from "express";
import { catchError, TryError } from "../util/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface PayloadInterface {
        id: mongoose.Types.ObjectId,
        fullname: string,
        email: string,
        mobile: string
        image: string | null
    }

export interface SessionInterface extends Request {
    session?: PayloadInterface
}


const AuthMiddleware = async (req:SessionInterface, res:Response, next:NextFunction)=>{
    
    try {
        const token = req.cookies.accessToken
    if(!token){
       throw TryError("Failed to authenticate", 401)
    }
    const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload
    
    req.session = {
        id:payload.id, 
        fullname: payload.fullname,
        email: payload.email,
        mobile: payload.mobile,
        image: payload.image,
    }
    next()
    } catch (error) {
       catchError(error, res)
    }
}

export default AuthMiddleware;  


