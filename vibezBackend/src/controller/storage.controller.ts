import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { catchError, TryError } from "../util/error";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const connection =new S3Client({
    region: process.env.AWS_REGION,
    endpoint: `https://s3-${process.env.AWS_REGION}.amazonaws.com`,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
})

const isFileExist = async (path:string)=>{
    try {
        const checkFileExist = new HeadObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: path
        })
         await connection.send(checkFileExist)
         return true
    } catch (err) {
        return false
    }
}

export const downloadFile = async (req:Request, res:Response)=>{
   
 try {
     const path = req.body?.path
    if(!path)
        throw TryError("File path is required", 400)

    const isExist = await isFileExist(path)

    if(!isExist)
        throw TryError("File not found", 404)

    const options = {
         Bucket: process.env.S3_BUCKET_NAME!,
        Key: path
    }

   const checkFileExist = new HeadObjectCommand(options)
   await connection.send(checkFileExist)

    const command = new GetObjectCommand(options)
  const url = await getSignedUrl(connection, command,{expiresIn: 60})
  res.json({url})
 } catch (err) {
    catchError(err, res, "Failed to download file")
 }
}  



export const uploadFile = async (req:Request, res:Response)=>{
    try {
        const path = req.body.path
        const type = req.body?.type

        if(!path || !type)
            throw TryError("File path and type are required", 400)
        
       const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: path,
            ContentType: type
        })
        const url = await getSignedUrl(connection, command, {expiresIn: 60})
        res.json({url})

    } catch (error) {
        catchError(error, res, "Failed to upload file")
    }
}