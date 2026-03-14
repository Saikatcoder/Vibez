import { Request, Response } from "express";
import { catchError, TryError } from "../util/error";
import { Downloads3Object, isFileExist, UploadS3Object } from "../util/s3";

export const downloadFile = async (req: Request, res: Response)=>{
    try {
        const path = req.body?.path 
        if(!path)
            throw TryError("Failed to generate download url because path is missing", 400)

        const isExist = await isFileExist(path)

        if(!isExist)
            throw TryError("File doesn`t exist exists", 404)

        const url = await Downloads3Object(path)
        res.json({url})
    }
    catch(err)
    {
        catchError(err, res, "Failed to generate download url")
    }
}

export const uploadFile = async (req: Request, res: Response)=>{
    try {
        const path = req.body?.path
        const type = req.body?.type
        const status = req.body?.status
        if(!path || !type || !status)
            throw TryError("Invalid request path or type is required", 400)
        
        const url = await UploadS3Object(path, type, status)
        res.json({url})
    }
    catch(err)
    {
        catchError(err, res, "Failed to generate upload url")
    }
}