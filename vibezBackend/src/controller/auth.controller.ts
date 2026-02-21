import { Request, Response } from "express";
import AuthModel from "../model/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { catchError, TryError } from "../util/error";

const accessTokenExpiry = "10m";

interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
}

interface ErrorMessage extends Error {
  message: string;
  status?: number;
}


const generateToken = (payload: PayloadInterface) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: accessTokenExpiry }
  );
};


export const signup = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, mobile } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await AuthModel.create({
      fullname,
      email,
      password: hashedPassword,
      mobile,
    });

    res.status(200).json({ message: "Signup Success" });
  } catch (err: unknown) {
    if(err instanceof Error){
      res.status(500).json({ message: err.message });
    }

  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await AuthModel.findOne({ email });
      
    if(!user){
      throw TryError("Invalid credentials", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
     throw TryError("Invalid credentials", 404);
    }

    const payload: PayloadInterface = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Login Success" });
  } catch (err: unknown) {
    catchError(err, res);
  }
};