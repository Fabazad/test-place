import { getStorageClient } from "../libs/StorageClient/index.js";
export class StorageController {
    static async generateUploadUrl(params) {
        const { fileName, fileType } = params;
        const storageClient = getStorageClient();
        const { uploadUrl, downloadUrl } = await storageClient.generateUploadUrl({
            fileName,
            fileType,
        });
        return { success: true, data: { uploadUrl, downloadUrl } };
    }
}
