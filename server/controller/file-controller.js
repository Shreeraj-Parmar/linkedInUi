import jwt from "jsonwebtoken";
import User from "../model/user.js";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { v4 as uuidv4 } from "uuid";
import dotEnv from "dotenv";
dotEnv.config();

// Initialize S3 with AWS credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// generate pre-signed url and sent into frontend
export const sendPreSignedURL = async (req, res) => {
  console.log(req.body);
  const fileName = `${uuidv4()}.${req.body.fileType.split("/")[1]}`; // Generate a unique file name

  try {
    const putObject = async (data) => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `ProfilePicture/${data}`,
      });

      const url = await getSignedUrl(s3Client, command);
      return url;
    };
    async function init() {
      let url = await putObject(fileName);
      console.log("url for uploading", url);
      if (url) {
        res.status(200).json({ url, fileName });
      } else {
        res.status(20).json({ message: "URL NOT FOUND FROM AWS" });
      }
    }
    init();
  } catch (error) {
    console.log(
      `error while calling sendPreSignedURL API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save permenent object url in database
export const saveURLIntoDB = async (req, res) => {
  console.log("receved tokened email is", req.user);
  // console.log(req.body);
  try {
    let saveURLInfo = await User.updateOne(
      { email: req.user },
      { $set: { profilePicture: req.body.url } }
    );
    console.log(saveURLInfo);
    if (saveURLInfo) {
      res.json({ message: "Token saved success fully" });
    } else {
      res.status(201).json({ message: "Error While Storing URL in db" });
    }
  } catch (error) {
    console.log(
      `error while calling saveURLIntoDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// generate presined for posts
export const sendPreSignedURLFORPOST = async (req, res) => {
  console.log(req.body);
  const fileName = `${uuidv4()}.${req.body.fileType.split("/")[1]}`; // Generate a unique file name

  try {
    const putObject = async (data) => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `PostPicture/${data}`,
      });

      const url = await getSignedUrl(s3Client, command);
      return url;
    };
    async function init() {
      let url = await putObject(fileName);
      console.log("url for uploading", url);
      if (url) {
        res.status(200).json({ url, fileName });
      } else {
        res.status(201).json({ message: "URL NOT FOUND FROM AWS" });
      }
    }
    init();
  } catch (error) {
    console.log(
      `error while calling sendPreSignedURLFORPOST API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
