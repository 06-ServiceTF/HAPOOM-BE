const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()

// S3 지역 및 인증 수단 변경
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const multerS3Middleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'hapoomimagebucket', // bucket 이름
    acl: 'public-read', // 이미지를 업로드한 후에도 이미지에 대한 접근 권한을 어떻게 할지 설정
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // 파일위치와 파일명을 지정해주는 코드, 시간 순으로 저장을 함
      cb(null, `images/${Date.now().toString()}_${file.originalname}`); 
    },
  }),
  // 5mb 제한
  limits: { fileSize: 5 * 1024 * 1024}
})

async function deleteImageFromS3( imageKey ) {
  const params = {
    Bucket: 'hapoomimagebucket', // 버킷 이름
    Key: imageKey, // 삭제할 이미지의 키 'images/1691343931840_multer.png'
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`S3에서 이미지 삭제 완료: ${imageKey}`);
  } catch (error) {
    console.error('S3 이미지 삭제 중 오류 발생:', error);
  }
}

module.exports = {
  multerS3Middleware,
  deleteImageFromS3
}