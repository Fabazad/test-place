import axios from "axios";
import BaseService from "./base.service";

class S3Service extends BaseService {

    constructor() {
        super('/s3');
    }

    async upload(file) {
        return new Promise((resolve, reject) => {
            // Split the filename to get the name and type
            let fileParts = file.name.split('.');
            let fileName = fileParts[0];
            let fileType = fileParts[1];
            console.log("Preparing the upload");
            axios.post(this.baseURL + "/sign-s3", {
                fileName,
                fileType
            })
            .then(response => {
                var returnData = response.data.data.returnData;
                var signedRequest = returnData.signedRequest;
                var url = returnData.url;
                console.log("Received a signed request " + signedRequest);
            
                // Put the fileType in the headers for the upload
                var options = {
                    headers: {
                        'Content-Type': fileType
                    }
                };
                axios.put(signedRequest, file, options)
                    .then(result => {
                        console.log("Response from s3");
                        resolve(url);
                    })
                    .catch(error => {
                        reject("ERROR " + JSON.stringify(error));
                    })
            })
            .catch(error => {
                reject(JSON.stringify(error));
            })
        });
    }
}

export default new S3Service();