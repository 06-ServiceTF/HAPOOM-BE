const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()

// S3 지역 및 인증 수단 변경
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const multerS3Middleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'hapoomimagebucket', // bucket 이름
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // DB에 저장되는 URL과 일치하게 만들어주기
      const now = Date.now().toString()
      const timeStamp = now.replace(/:/g, `-`)
      const fileName = file.originalname
      const filePath = `images/${timeStamp}_${fileName}`
      cb(null, filePath)
    }
  }),
  // 5mb 제한
  limits: { fileSize: 5 * 1024 * 1024}
})

// 트랜잭션을 위해 인수 추가
const deleteImageFromS3 = async (transaction, imageKey) => {
  const params = {
    bucket: 'hapoomimagebucket',
    key: imageKey
  };

  try {
    await s3.deleteObject(params).promise()
    console.log('S3 버킷에서 이미지 삭제 성공')
    return true
  } catch (err) {
    console.error('S3 버킷에서 이미지 삭제 실패', err)
  }
};

module.exports = {
  multerS3Middleware,
  deleteImageFromS3
}