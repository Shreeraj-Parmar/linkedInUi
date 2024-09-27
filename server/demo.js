import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotEnv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotEnv.config();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// const getObjectURL = async (key) => {
//   const command = new GetObjectCommand({
//     Bucket: "privet-for-nodejs",
//     Key: key,
//   });

//   const url = await getSignedUrl(s3Client, command);
//   return url;

const putObject = async (filename) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `upload/user-upload/${filename}`,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
};

const listObjects = async () => {
  const command = new ListObjectsV2Command({
    Bucket: "privet-for-nodejs",
    Key: `/`,
  });
  const res = await s3Client.send(command);
  console.log(res);
};

async function init() {
  //   const cmd = new DeleteObjectCommand({
  //     Bucket: "privet-for-nodejs",
  //     Key: "upload/user-upload/image-1722700881456.jpg",
  //   });

  //   await s3Client.send(cmd);

  // await listObjects();
  // console.log(
  //   "url for image-55 :",
  //   await getObjectURL("upload/user-upload/image-1722700881456.jpg")
  // );
  console.log("url for uploading", await putObject(`image-${Date.now()}.jpg`));
}

init();
