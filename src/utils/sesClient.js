const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_SECRET_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
  },
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
