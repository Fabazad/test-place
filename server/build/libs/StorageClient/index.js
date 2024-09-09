
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e29314eb-53eb-5c30-a943-8d88cc3bf2b1")}catch(e){}}();
import { configs } from "../../configs.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
const createStorageClient = () => {
    const s3 = new S3({
        region: "eu-north-1",
        credentials: {
            accessKeyId: configs.AWS_ACCESS_KEY_ID,
            secretAccessKey: configs.AWS_SECRET_KEY,
        },
    });
    return {
        generateUploadUrl: async (params) => {
            const { fileName, fileType } = params;
            const key = `product-pictures/${fileName}-${uuidv4()}`;
            const signedUrl = await await getSignedUrl(s3, new PutObjectCommand({
                Bucket: configs.S3_BUCKET,
                Key: key,
                ContentType: fileType,
            }), {
                expiresIn: 500,
            });
            return {
                uploadUrl: signedUrl,
                downloadUrl: `https://${configs.S3_BUCKET}.s3.amazonaws.com/${key}`,
            };
        },
    };
};
export const getStorageClient = createSingletonGetter(createStorageClient);
//# sourceMappingURL=index.js.map
//# debugId=e29314eb-53eb-5c30-a943-8d88cc3bf2b1
