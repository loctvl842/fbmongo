const dotenv = require('dotenv');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
});

// upload a file to s3
exports.uploadFile = () => {
    return multer({
        storage: multerS3({
            s3,
            bucket: bucketName,
            metadata: function (req, file, cb) {
                cb(null, { fieldname: file.fieldname });
            },
            key: function (req, file, cb) {
                console.log('loc ', { file });
                cb(null, `${file.fieldname}-${Date.now()}.jpeg`);
            },
            contentType: (req, file, cb) => {
                cb(null, file.mimetype);
            },
        }),
    });
};

exports.upload;
