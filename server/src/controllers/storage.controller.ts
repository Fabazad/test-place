import { getStorageClient } from "@/libs/StorageClient/index.js";
import { CustomResponse } from "@/utils/CustomResponse.js";

export class StorageController {
  static async generateUploadUrl(params: { fileName: string; fileType: string }): Promise<
    CustomResponse<{
      uploadUrl: string;
      downloadUrl: string;
    }>
  > {
    const { fileName, fileType } = params;

    const storageClient = getStorageClient();

    const { uploadUrl, downloadUrl } = await storageClient.generateUploadUrl({
      fileName,
      fileType,
    });

    return { success: true, data: { uploadUrl, downloadUrl } };
  }
}
