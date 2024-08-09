import axios from "axios";
import BaseService from "./base.service";

class S3Service extends BaseService {
  constructor() {
    super("/storage");
  }

  async upload(file) {
    // Split the filename to get the name and type
    let fileParts = file.name.split(".");
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    console.log("Preparing the upload");
    const response = await axios.post(this.baseURL + "/upload-url", {
      fileName,
      fileType,
    });

    const { uploadUrl, downloadUrl } = response.data;

    await axios.put(uploadUrl, file, { headers: { "Content-Type": fileType } });

    return downloadUrl;
  }
}

export default new S3Service();
