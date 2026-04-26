import { 
  GetObjectCommand, 
  HeadObjectCommand, 
  PutObjectCommand, 
  S3Client 
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type AclType = "private" | "public-read";

const S3connection = new S3Client({
  region: process.env.AWS_REGION, // ✅ correct
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const isFileExist = async (path: string) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: path,
    });

    await S3connection.send(command);
    return true;
  } catch {
    return false;
  }
};

const Downloads3Object = async (path: string, expiry: number = 60) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: path,
  });

  return await getSignedUrl(S3connection, command, {
    expiresIn: expiry,
  });
};

const UploadS3Object = async (
  path: string,
  type: string,
  acl: AclType = "public-read" // 🔥 important
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: path,
    ContentType: type,
    ACL: acl,
  });

  return await getSignedUrl(S3connection, command, {
    expiresIn: 60,
  });
};

export {
  S3connection,
  UploadS3Object,
  Downloads3Object,
  isFileExist,
};