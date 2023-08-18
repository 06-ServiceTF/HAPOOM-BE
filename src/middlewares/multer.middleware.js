const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Posts용 multerS3 미들웨어 (fields)
const multerMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'hapoomimagebucket', 
    acl: 'public-read', 
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      let folderName = 'images'

      if(file.mimetype.startsWith('audio/')) {
        folderName = 'audios'
      }
      cb(null, `${folderName}/${Date.now().toString()}_${file.originalname}`); 
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024}
});

// S3 버킷 이미지 및 오디오 삭제 함수
async function deleteS3( imageKey ) {
  const params = {
    Bucket: 'hapoomimagebucket', 
    Key: imageKey, // 삭제할 이미지의 키 'images/1691343931840_multer.png'
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`S3에서 이미지 삭제 완료: ${imageKey}`);
  } catch (error) {
    console.error('S3 이미지 삭제 중 오류 발생:', error);
  }
};

module.exports = {multerMiddleware, deleteS3}