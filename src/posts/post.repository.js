// repositories/postRepository.js

const { Posts, Images, Records, Users, Tags, Mappings, Likes, Sequelize,Reports } = require('../models');
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
      const user = await Users.findOne({ where: { userId: post.dataValues.userId } });
      const mappings = await Mappings.findAll({ where: { postId: postId }, include: Tags });
      const likeCount = await Likes.count({
        where: { postId }
      });
      const reportCount = await Reports.count({
        where: { postId }
      });

      if (!post || !images || !user) {
        throw { status: 404, message: 'Post not found' };
      }
    
      const tag = mappings?.map(tagInfo => tagInfo.Tag.tag);
      
      return { post, images, user, tag, likeCount,reportCount }
      
    } catch (error) {
      console.error('Error getting post:', error);
      throw { status: 500, message: 'Error getting post' };
    }
  };

  findLatestPost = async () => {
    try {
      const posts = await Posts.findAll({
        limit: 10, // 최신 10개를 가져옵니다.
        order: [
          ['createdAt', 'DESC']
        ]
      });

      // 10개 중 랜덤하게 한 개를 선택합니다.
      const randomIndex = Math.floor(Math.random() * posts.length);
      const post = posts[randomIndex];

      const images = await Images.findAll({ where: { postId: post.dataValues.postId } });
      const user = await Users.findOne({ where: { userId: post.dataValues.userId } });
      const mappings = await Mappings.findAll({ where: { postId: post.dataValues.postId }, include: Tags });
      const likeCount = await Likes.count({
        where: { postId: post.dataValues.postId }
      });
      const reportCount = await Reports.count({
        where: { postId: post.dataValues.postId }
      });

      if (!post || !images || !user) {
        throw { status: 404, message: 'Post not found' };
      }

      const tag = mappings?.map(tagInfo => tagInfo.Tag.tag);

      return { post, images, user, tag, likeCount, reportCount }

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
      let { content, musicType, musicUrl, musicTitle, latitude, longitude, placeName, tag,imageURL } = body;
      const images = files['image'];
      const audio = files['audio'] ? files['audio'][0] : null;

      console.log(imageURL)

      if (musicType==="3") {
        musicTitle = '녹음된 음원';
        musicUrl = audio ? audio.location : musicUrl;
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
        });

     // update tag
      const mappings = await Mappings.findAll({ where: { postId }})
      if (mappings.length) {
        if (tag.length) {
          await Mappings.destroy({ where: { postId: post.dataValues.postId }})

          const tagArr = tag.split(","); 
    
          for (const originalTag of tagArr) {
            const trimmedTag = originalTag.trim().replace(/#/g, "").replace(/\s/g, "");
        
            const [item, result] = await Tags.findOrCreate({
              where: { tag: trimmedTag }
            });
        
            await Mappings.create({
              postId: post.dataValues.postId,
              tagId: item.tagId
            });
          };
        }

        if (!tag.length) {
          await Mappings.destroy({ where: { postId: post.dataValues.postId }})
        }
      }

      if(audio) {
        const audioDelete = await Records.findOne({where: {postId: post.postId}})
        if (audioDelete) {
          const audioPath = new URL(audioDelete.dataValues.url).pathname.substr(1)
          await deleteS3(audioPath)
          await Records.destroy({where: {postId: postId}});
        }
      }

      const imageDelete = await Images.findAll({ where: { postId: post.postId }});

      const urlsToDelete = imageDelete.map(image => image.url); // imageDelete 배열에서 URL만 추출합니다.

      const urlsNotIncluded = imageDelete.filter(image => !imageURL.includes(image.url));

      console.log('urlsToDelete:',urlsToDelete)
      console.log("urlIsNotIncluded:",urlsNotIncluded)
      //console.log('imageDelete:',imageDelete)
      console.log('imageURL:',imageURL)

      if(urlsNotIncluded) {
        const s3DeletePromises = urlsNotIncluded.map(async (image) => {
          const imagePath = new URL(image.dataValues.url).pathname.substr(1)
          await Images.destroy({where: {imageId: image.imageId}});
          return deleteS3(imagePath)
        })
        await Promise.all(s3DeletePromises)
        //await Images.destroy({where: {imageId: image.imageId}});
      }

      if(images){
      const imagePromises = images.map((image) => {
        return Images.create({ url: image.location, postId: postId, userId: post.dataValues.userId });
      });


        await Promise.all(imagePromises);
      }

      console.log(audio)

      if (musicType==="3" && audio) {
        await Records.create({
          url: audio.location,
          postId: post.dataValues.postId,
          userId: post.dataValues.userId,
        });
      }

      await post.update({ content,
        musicTitle,
        musicUrl,
        latitude,
        longitude,
        placeName,
        musicType,
        private: false,
        tag});

    } catch (err) {
      console.error(err);
      throw { status: 500, message: 'Error updating post' };
    }
  };

  deletePost = async (postId) => {
    try {
      // Find and delete the post
      const post = await Posts.findOne({ where: { postId: postId } });
      const mappings = await Mappings.findAll({ where: { postId }})

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

      // delete mappings
      if (mappings.length) {
        await Mappings.destroy({ where: { postId }})
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
      userId
    });

    if (tag) {
      const tagArr = tag.split(","); 
    
      for (const originalTag of tagArr) {
        const trimmedTag = originalTag.trim().replace(/#/g, "").replace(/\s/g, "");
    
        const [item, result] = await Tags.findOrCreate({
          where: { tag: trimmedTag }
        });
    
        await Mappings.create({
          postId: post.dataValues.postId,
          tagId: item.tagId
        });
      };
    };

    if (images) {
      const imagePromises = images.map((image) => {
        return Images.create({
          url: image.location,
          postId: post.dataValues.postId,
          userId
        });
      });

      await Promise.all(imagePromises);
    }


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
  } catch (err){
    console.error(err);
    throw new Error('Error uploading');
  }
  }
}

module.exports = PostRepository;