import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { catchError, TryError } from "../util/error";

const accessTokenExpiry = '10m'

interface PayloadInterface {
    id: mongoose.Types.ObjectId
    fullname: string
    email: string
    mobile: string
}

const generateToken = (payload: PayloadInterface)=>{
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn: accessTokenExpiry})
    return accessToken
}

export const signup = async (req: Request, res: Response)=>{
    try {
        await AuthModel.create(req.body)
        res.json({message: "Signup success"})
    }
    catch(err: unknown)
    {
        if(err instanceof Error)
        res.status(500).json({message: err.message})
    }
}

export const login = async (req: Request, res: Response)=>{
   try {
        const {email, password} = req.body
        const user = await AuthModel.findOne({email})
        
        if(!user)
        throw TryError("User not found, please try to signup first", 404)
        
        const isLogin = await bcrypt.compare(password, user.password)

        if(!isLogin)
        throw TryError("Invalid credentials email or password incorrect", 401)

        const payload = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            mobile: user.mobile
        }
        const options = {
            httpOnly: true,
            maxAge: (10*60)*1000,
            secure: false,
            domain: 'localhost'
        }
        const accessToken = generateToken(payload)
        res.cookie("accessToken", accessToken, options)
        res.json({message: 'Login success'})
   }
   catch(err: unknown)
   {
        catchError(err, res, "Login failed please try after sometime")
   }
}

export const forgotPassword = (req: Request, res: Response)=>{
    res.send("hello")
}

export const getSession = async (req: Request, res: Response)=>{
    try {
        const accessToken = req.cookies.accessToken

        if(!accessToken)
            throw TryError("Invalid session", 401)

        const session = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY!)
        res.json(session)
    }
    catch(err)
    {
        catchError(err, res, "Invalid session")
    }
}