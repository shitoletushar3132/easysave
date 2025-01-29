const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  httpOptions: {
    timeout: 60000, // timeout in milliseconds, adjust as needed
  },
});

export default s3;
