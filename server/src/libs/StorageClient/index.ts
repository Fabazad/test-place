import { configs } from "@/configs.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import awsSdk from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { StorageClient } from "./type.js";

const createStorageClient = (): StorageClient => {
  awsSdk.config.update({
    region: "eu-west-3",
    signatureVersion: "v4",
    accessKeyId: configs.AWS_ACCESS_KEY_ID,
    secretAccessKey: configs.AWS_SECRET_KEY,
  });

  const s3 = new awsSdk.S3();
  return {
    generateUploadUrl: async (params: { fileName: string; fileType: string }) => {
      const { fileName, fileType } = params;

      const key = `product-pictures/${fileName}-${uuidv4()}`;

      const signedUrl = await s3.getSignedUrl("putObject", {
        Bucket: configs.S3_BUCKET,
        Key: key,
        Expires: 500,
        ContentType: fileType,
        ACL: "public-read",
      });

      return {
        uploadUrl: signedUrl,
        downloadUrl: `https://${configs.S3_BUCKET}.s3.amazonaws.com/${key}`,
      };
    },
  };
};

export const getStorageClient = createSingletonGetter(createStorageClient);
