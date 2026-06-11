import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
import "dotenv/config";

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("Missing R2 environment variables");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function createUploadUrl(params: {
  key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: params.key,
    ContentType: params.contentType,
  });

  return getSignedUrl(r2, command, {
    expiresIn: 60 * 5,
  });
}

export async function deleteR2Object(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return r2.send(command);
}