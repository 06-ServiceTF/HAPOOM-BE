// repositories/postRepository.js

const { Posts, Images, Records, Users} = require('../models');
const { deleteS3 } = require('../middlewares/multer.middleware')
const jwt = require("jsonwebtoken"); // 모델을 가져옵니다.
const dotenv = require("dotenv");
dotenv.config();

class PostRepository {
  constructor() {
  }
  getPostById = async (postId) => {
    try {
      const post = await Posts.findOne({ where: { postId: postId } });
      const images = await Images.findAll({ where: { postId: postId } });
      const user = await Users.findOne({ where: { postId: postId } });

      if (!post) {
        throw { status: 404, message: 'Post not found' };
      }

      return { post, images, user };
    } catch (error) {
      console.error('Error getting post:', error);
      throw { status: 500, message: 'Error getting post' };
    }
  };

  updatePost = async (postId, body, files, host) => {
    try {
      // Find the existing post
      const post = await Posts.findByPk(postId);

      if (!post) {
        throw { status: 404, message: 'Post not found' };
      }

      // Extract the information
      let { content, musicType, musicUrl, musicTitle, latitude, longitude, placeName, tag } = body;
      const images = files['image'];
      const audio = files['audio'] ? files['audio'][0] : null;

      if (musicType==="2") {
        switch (musicUrl){
          case "1":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/1.Alan Walker - Dreamer (BEAUZ & Heleen Remix) [NCS Release].mp3`;
            musicTitle='Alan Walker - Dreamer (BEAUZ & Heleen Remix) [NCS Release]';
            break;
          case "2":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/2.Arcando & Maazel - To Be Loved (feat. Salvo) [NCS Release].mp3`;
            musicTitle='Arcando & Maazel - To Be Loved (feat. Salvo) [NCS Release]';
            break;
          case "3":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/3.AX.EL - In Love With a Ghost [NCS Release].mp3`;
            musicTitle='AX.EL - In Love With a Ghost [NCS Release]';
            break;
          case "4":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/4.Idle Days - Over It [NCS Release].mp3`
            musicTitle='Idle Days - Over It [NCS Release]'
            break;
          case "5":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/5.ROY KNOX - Closer [NCS Release].mp3`
            musicTitle='ROY KNOX - Closer [NCS Release]'
            break;
        }
      }

      if (musicType==="3") {
        musicTitle='녹음된 음원';
        musicUrl = audio.location;
      }

      // Update the post

      await post.update({ content,
        musicTitle,
        musicUrl,
        latitude,
        longitude,
        placeName,
        musicType,
        private: false,
        tag});

      // Delete old images and audio
      const audioDelete = await Records.findOne({ where: { postId: post.postId }})
      if(audioDelete) {
        const audioPath = new URL(audioDelete.dataValues.url).pathname.substr(1)
        await deleteS3(audioPath)
        await Records.destroy({where: {postId: postId}});
      }

      const imageDelete = await Images.findAll({ where: { postId: post.postId }})
      if(imageDelete) {
        const s3DeletePromises = imageDelete.map((image) => {
          const imagePath = new URL(image.dataValues.url).pathname.substr(1)
          return deleteS3(imagePath)
        })

        await Promise.all(s3DeletePromises)

        await Images.destroy({where: {postId: postId}});
      }

      const imagePromises = images.map((image) => {
        return Images.create({ url: image.location, postId: postId, userId: post.dataValues.userId });
      });

      await Promise.all(imagePromises);

      console.log(audio)

      if (musicType==="3" && audio) {
        await Records.create({
          url: audio.location,
          postId: post.dataValues.postId,
          userId: post.dataValues.userId,
        });
      }

    } catch (err) {
      console.error(err);
      throw { status: 500, message: 'Error updating post' };
    }
  };


  deletePost = async (postId) => {
    try {
      // Find and delete the post
      const post = await Posts.findOne({ where: { postId: postId } });

      if (!post) {
        throw { status: 404, message: 'Post not found' };
      }

      // Find and delete images
      const images = await Images.findAll({ where: { postId: post.postId } });
  
      const s3DeletePromises = images.map((image) => {
        const imagePath = new URL(image.dataValues.url).pathname.substr(1)
        return deleteS3(imagePath)
      })

      await Promise.all(s3DeletePromises)

      const imageDeletePromises = images.map((image) => {
        return image.destroy();
      });

      await Promise.all(imageDeletePromises);

      // Find and delete audio
      const audioDelete = await Records.findOne({ where: { postId: post.postId }})
      if(audioDelete) {
        const audioPath = new URL(audioDelete.dataValues.url).pathname.substr(1)
        await deleteS3(audioPath)
      }

      // Delete post
      await post.destroy();
    } catch (err) {
      console.error(err);
      throw { status: 500, message: 'Error deleting post' };
    }

  };

  createPost = async (userId,body, files, host) => {
  try {
    let { content, musicType, musicUrl, musicTitle, latitude, longitude, placeName, tag } = body;
    const images = files['image'];
    const audio = files['audio'] ? files['audio'][0] : null;

    if (musicType==="2") {
      switch (musicUrl){
        case "1":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/1.Alan Walker - Dreamer (BEAUZ & Heleen Remix) [NCS Release].mp3`
          musicTitle='Alan Walker - Dreamer (BEAUZ & Heleen Remix) [NCS Release]'
          break;
        case "2":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/2.Arcando & Maazel - To Be Loved (feat. Salvo) [NCS Release].mp3`
          musicTitle='Arcando & Maazel - To Be Loved (feat. Salvo) [NCS Release]'
          break;
        case "3":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/3.AX.EL - In Love With a Ghost [NCS Release].mp3`
          musicTitle='AX.EL - In Love With a Ghost [NCS Release]'
          break;
        case "4":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/4.Idle Days - Over It [NCS Release].mp3`
          musicTitle='Idle Days - Over It [NCS Release]'
          break;
        case "5":musicUrl=`${process.env.ORIGIN_BACK}/publicMusic/5.ROY KNOX - Closer [NCS Release].mp3`
          musicTitle='ROY KNOX - Closer [NCS Release]'
          break;
      }
    }

    if (musicType==="3") {
      musicTitle = '녹음된 음원';
      musicUrl = audio.location;
    }

    const post = await Posts.create({
      content,
      musicTitle,
      musicUrl,
      latitude,
      longitude,
      placeName,
      musicType,
      private: false,
      tag,
      userId
    });

    const imagePromises = images.map((image) => {
      return Images.create({
        url: image.location,
        postId: post.dataValues.postId,
        userId
      });
    });

    await Promise.all(imagePromises);

    if (musicType === "3" && audio) {
      const audioUrl = audio.location;
      try {
        await Records.create({
          url: audioUrl,
          postId: post.dataValues.postId,
          userId
        });
      } catch (err) {
        console.error(err);
        throw new Error('Error uploading audio file');
      }
    }

    return { message: 'Post received' };
  }catch (err){
    console.error(err);
    throw new Error('Error uploading');
  }
  }
}

module.exports = PostRepository;