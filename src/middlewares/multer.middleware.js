const multer = require('multer');
const path = require('path')
const fs = require('fs');

try {
	fs.readdirSync('uploads'); // 폴더 확인
} catch(err) {
	console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 생성
}

const multerMiddleware = multer({
    storage: multer.diskStorage({ 				
        destination(req, file, cb) { 
            cb(null, 'uploads/'); 
        },
        filename(req, file, cb) { 
						// 파일의 확장자
            const ext = path.extname(file.originalname); 
						// 파일이름 + 날짜 + 확장자 이름으로 저장
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); 
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
});

const deleteImage = function (imagePath) {
    try {
        fs.unlinkSync(imagePath)
        console.log('이미지 삭제 성공', imagePath)
    } catch (err) {
        console.error('이미지 삭제 실패', err)
    }
}


module.exports = {multerMiddleware, deleteImage}