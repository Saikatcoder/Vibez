import { Response } from "express";

interface ErrorMessage extends Error {
  message: string;
  status?: number;
}


export const TryError = (message:string , status:number=500)=>{
    const err : ErrorMessage = new Error(message);
    err.status = status;
    return err;
}


export const catchError = (err: unknown, res: Response)=>{
    if(err instanceof Error){
        const status = (err as ErrorMessage).status || 500
        res.status(status).json({ message: err.message });
    }
}