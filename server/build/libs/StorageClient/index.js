import { configs } from "../../configs.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import awsSdk from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
const createStorageClient = () => {
    awsSdk.config.update({
        region: "eu-north-1",
        accessKeyId: configs.AWS_ACCESS_KEY_ID,
        secretAccessKey: configs.AWS_SECRET_KEY,
    });
    const s3 = new awsSdk.S3();
    return {
        generateUploadUrl: async (params) => {
            const { fileName, fileType } = params;
            const key = `product-pictures/${fileName}-${uuidv4()}`;
            const signedUrl = await s3.getSignedUrl("putObject", {
                Bucket: configs.S3_BUCKET,
                Key: key,
                Expires: 500,
                ContentType: fileType,
            });
            return {
                uploadUrl: signedUrl,
                downloadUrl: `https://${configs.S3_BUCKET}.s3.amazonaws.com/${key}`,
            };
        },
    };
};
export const getStorageClient = createSingletonGetter(createStorageClient);
