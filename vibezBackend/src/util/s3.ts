import {  GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

type AclType = "private" | "public-read";

const S3connection = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: `https://s3-${process.env.AWS_REGION}.amazonaws.com`,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
    }
})


const isFileExist = async (path:string)=>{
    try {
        const command = new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: path
        })
            await S3connection.send(command)
            return true

    } catch (error) {
        return false
    }
}

 const Downloads3Object = async( path: string , expiry : number = 60 ,) => {
   const option = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: path,
   }

   const command = new GetObjectCommand(option)

    const url = await getSignedUrl(S3connection, command, { expiresIn: expiry })
    return url
}


const UploadS3Object = async( path: string , type:string, acl:AclType= "private") => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: path,
        ContentType: type,
        ACL: acl
    })

    const url = await getSignedUrl(S3connection, command, { expiresIn: 60 })
    return url
}


export { S3connection, UploadS3Object, Downloads3Object , isFileExist }

