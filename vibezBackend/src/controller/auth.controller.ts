import { Request,Response } from "express"
import AuthModel from "../model/auth.model"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"


const accessToeknExpiry = '10m'

interface payloadInterface {
    id: mongoose.Types.ObjectId,
    fullname: string,
    email: string
    mobile: string
}

const generateToekn = (payload:payloadInterface)=>{
 const token = jwt.sign(payload, process.env.JWT_SECRET_KEY! , {expiresIn:accessToeknExpiry})
 return token
}
export const signup = async (req:Request, res:Response)=>{
    try {
        await AuthModel.create(req.body)
        res.status(200).json({message: "Signup Success"})
    } catch (err:any) {
        res.status(500).json({message:err.message})
    }
}

export const login = async(req:Request, res:Response )=>{
    try {
        const {email,password} = req.body
        const user = await AuthModel.findOne({email})

        if(!user)
           throw new Error("please signup first")
      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch)
        throw new Error("Invalid Credentials")

      res.json({message:"Login Success"})
     
      const payload = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile
      }
     
    const token = generateToekn(payload)
    res.json({message:"Login Success", token})

    } catch (err :any) {
        res.status(500).json({message:err.message})
    }
}

