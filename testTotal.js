// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer 이미지 저장
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 업로드할 디렉토리 설정
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-'); // ':' 문자를 '-' 문자로 대체
    cb(null, date + file.originalname); // 저장될 파일명 설정
  }
});

const upload = multer({storage: storage});

//게시글 쓰기
router.post('/post', upload.array('image', 5), async (req, res) => {
  const images = req.files;
  const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
  try {
    const token = req.cookies.refreshToken;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Users.findOne({ email: decoded.email });

    console.log(tag)
    // 게시글 생성
    const post = await Posts.create({
      content,
      musicTitle,
      musicUrl,
      latitude,
      longitude,
      placeName,
      private:false,
      tag,
      userId: user.dataValues.userId
    });
    console.log(images)

    console.log(post.dataValues.postId)
    // 이미지 저장
    const imagePromises = images.map((image) => {
      return Images.create({
        url: req.protocol + '://' + req.get('host') + '/' + image.path, // 파일 경로를 URL로 변환
        postId: post.dataValues.postId,
        userId: user.dataValues.userId
      });
    });

    await Promise.all(imagePromises);

    res.status(200).send({ message: 'Post received' });
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: 'Error creating post' });
  }
});

//게시글 상세보기
router.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Posts.findOne({
      where: {
        postId: postId
      }
    });

    const images = await Images.findAll({
      where: {
        postId: postId
      }
    });

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    res.send({post,images});

  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).send({ error: 'Error getting post' });
  }
});

// 게시글 수정기능
router.put('/post/:postId', upload.array('image', 5), async (req, res) => {
  const images = req.files;
  const { content, musicTitle, musicUrl, tag, latitude, longitude, placeName } = req.body;
  const postId = req.params.postId;

  try {
    // Find the existing post
    const post = await Posts.findByPk(postId);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    // Update the post
    await post.update({
      content,
      musicTitle,
      musicUrl,
      latitude,
      longitude,
      placeName,
      private:false,
      tag
    });

    // Delete old images
    await Images.destroy({
      where: {
        postId: postId
      }
    });

    // Add new images
    const imagePromises = images.map((image) => {
      return Images.create({
        url: req.protocol + '://' + req.get('host') + '/' + image.path, // 파일 경로를 URL로 변환
        postId: postId,
        userId: post.dataValues.userId
      });
    });

    await Promise.all(imagePromises);

    res.status(200).send({ message: 'Post updated' });
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: 'Error updating post' });
  }
});