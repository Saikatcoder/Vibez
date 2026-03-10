import { NextFunction, Request, Response } from "express";
import { catchError, TryError } from "../util/error";
import AuthModel from "../model/auth.model";
import { SessionInterface } from "./auth.middleware";


export const RefreshToken = async (req: SessionInterface, res: Response , next: NextFunction)=>{
   try {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken)
        throw TryError("Invalid session", 401)

     const user = await AuthModel.findOne({refreshToken})
     if(!user)
      throw TryError("Invalid session", 401)
   
   const expiry = user?.expiry
   if(!expiry || expiry < new Date())
      throw TryError("Session expired", 401)

   req.session = {
      id : user._id,
      email: user.email,
      fullname: user.fullname,
      image: user.image ?? null,
      mobile: user.mobile
   }


     next()
   } catch (error) {
     catchError(error, res, "Failed to refresh access token")
   }
}

