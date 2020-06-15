const constants = require("../helpers/constants");
var aws = require('aws-sdk');
require('dotenv').config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey

aws.config.update({
  region: 'eu-west-3', // Put your aws region here
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const S3_BUCKET = constants.S3_BUCKET;

class S3Controller {
    static async signS3(fileName, fileType) {
        return new Promise((resolve, reject) => {
            const s3 = new aws.S3();  // Create a new instance of S3
        // Set up the payload of what we are sending to the S3 api
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: 'product-pictures/' + fileName,
                Expires: 500,
                ContentType: fileType,
                ACL: 'public-read'
            };
            // Make a request to the S3 API to get a signed URL which we can use to upload our file
            s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                reject({success: false, error: err})
            }
            // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
            const returnData = {
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/product-pictures/${fileName}`
            };
            // Send it all back
            return resolve({success:true, data:{returnData}});
            });
        });
        
    }
}
// Now lets export this function so we can call it from somewhere else

module.exports = S3Controller;