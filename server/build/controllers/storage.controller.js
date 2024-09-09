
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bdf9b8c9-3777-52e8-8c3d-6a92fb95ebb8")}catch(e){}}();
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
//# sourceMappingURL=storage.controller.js.map
//# debugId=bdf9b8c9-3777-52e8-8c3d-6a92fb95ebb8
