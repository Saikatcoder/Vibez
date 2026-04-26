import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { catchError, TryError } from "../util/error";
import { SessionInterface } from "../middleware/auth.middleware";
import { v4 as uuid } from "uuid";
import moment from "moment";


const accessTokenExpiry = '40m'
const tenminutes =( 40*60)*1000
const sevenDaysMs = (7*24*60*60)*1000

type TokenType = 'accessToken' | 'refreshToken'


interface PayloadInterface {
    id: mongoose.Types.ObjectId
    fullname: string
    email: string
    mobile: string
}


const generateToken = (payload: PayloadInterface)=>{
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn: accessTokenExpiry})
    const refreshToken = uuid()
    return {
        accessToken,
        refreshToken
    }
}


const getoptions=(tokenType: TokenType)=>{
    return {
        httpOnly: true,
        maxAge: tokenType === 'accessToken' ? tenminutes : sevenDaysMs,
        domain: 'localhost'
    }
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
        mobile: user.mobile,
        image: user.image
    }
    const {accessToken, refreshToken} = generateToken(payload)

        await AuthModel.updateOne({_id: user._id}, 
            {$set:{ 
            refreshToken,
            expiry : moment().add(7, 'days').toDate()
        }})
        

        res.cookie("accessToken", accessToken, getoptions('accessToken'))
        res.cookie("refreshToken", refreshToken, getoptions('refreshToken'))
        res.json({message: 'Login success'})
        
   }
   catch(err: unknown)
   {
        catchError(err, res, "Login failed please try after sometime")
   }
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



export const updateProfilePicture = async (req: SessionInterface, res: Response)=>{
    try {
        const path = `${process.env.S3_URL}/${req.body.path}`

        if(!path || !req.session)
            throw TryError("Failed to update profile picture", 400)

        await AuthModel.updateOne({_id: req.session.id}, {$set: {image: path}})
       
        res.json({image: path})
    }
    catch(err)
    {
       
        catchError(err, res, "Failed to update profile picture")
    }
}

export const refreshToken = async (req: SessionInterface, res: Response)=>{
    try{
        if(!req.session)
        throw TryError("Invalid session", 401)

   
    const {accessToken, refreshToken} = generateToken(req.session)

    await AuthModel.updateOne({_id: req.session.id},
        {$set: {
            refreshToken,
            expiry : moment().add(7, 'days').toDate()
        }})

        res.cookie("accessToken", accessToken, getoptions('accessToken'))
        res.cookie("refreshToken", refreshToken, getoptions('refreshToken'))
        res.json({message: 'Access token refreshed successfully'})
    }catch(err)
    {
        catchError(err, res, "Failed to refresh access token")
    }
}


export const logout = async (req: SessionInterface, res: Response)=>{
    try {
        const options = {
            httpOnly: true,
            maxAge: 0,
            domain: 'localhost',
            secure: false,
        }
        res.clearCookie("accessToken",options)
        res.clearCookie("refreshToken", options)
        res.json({message: 'Logged out successfully'})
    }
    catch (error) {
        catchError(error, res)
    }
}