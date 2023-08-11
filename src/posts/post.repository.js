const { Posts, Users, Likes, Images,Comments,Reports, sequelize, Sequelize } = require('../models');
const { Op } = require("sequelize");

class PostRepository {

  //* 게시글 생성
  createPostImage = async(
    email,
    content,
    musicTitle,
    musicUrl,
    tag,
    latitude,
    longitude,
    placeName,
    imageUrl,
    transaction
  ) => {

    // // 게시글 test
    // content = "test"
    // musicTitle = "test"
    // musicUrl = "test"
    // tag = "[#test, #test, #test]"
    // latitude = 11.222
    // longitude = 11.222
    // placeName = "test"

    // email로 userId 찾기
    const user = await Users.findOne({
      where: { email },
      attributes: [
        'userId'
      ]
    }, {transaction})

    // 게시물 생성
    const createPost = await Posts.create({
      userId: user.dataValues.userId,
      content,
      musicTitle,
      musicUrl,
      tag,
      latitude,
      longitude,
      placeName
    }, {transaction})

    // 이미지 테이블 생성
    const createImage = imageUrl.map(async(url) => {
      return await Images.create({
        postId: createPost.dataValues.postId,
        userId: user.dataValues.userId,
        url: url
      })
    }, {transaction})

    return {createPost, createImage}
  };
  
  //* 게시글 상세보기
  readPost = async(
    email,
    postId
  ) => {
    const readPost = await Posts.findOne({
      where: { postId },
      attributes: [
        'userId',
        'postId',
        'content',
        'latitude',
        'longitude',
        'private'
      ],
      include: [
        {
          model: Images,
          attributes: [
            'imageId',
            'postId',
            'userId',
            'url',
            'createdAt',
            'updatedAt'
          ]
        },
        {
          model: Users,
          attributes: ['nickname', 'userImage']
        },
        {
          model: Comments,
          attributes: [
            'postId',
            'userId', 
            'comment', 
            'createdAt',
            'updatedAt'
          ]
        },
        {
          model: Likes,
          attributes: ['userId']
        },
        {
          model: Likes,
          attributes: [
            [sequelize.literal(`(
              SELECT
                count(*)
              FROM
                Likes
              WHERE
                Likes.postId  = Posts.postId
            )`), 'likeCount']
          ]
        }
      ],
    })
      // 좋아요가 하나도 없을 시 return
      if(!readPost.dataValues.Likes[0]) {
        const isLiked = 0
        const likeCount = 0
        readPost.isLiked = isLiked
        readPost.likeCount = likeCount
        
        return readPost
      }
    // console.log('readPost', readPost)
    // console.log('readPost.LIkes', readPost.dataValues.Likes) // 값이 없다면 빈 배열

    // 좋아요가 아무것도 없다면 에러가 발생하니까 에러가 안나게 처리를 해줘야 함
    // console.log('readPost.LIkes.likeCount', readPost.dataValues.Likes[0])// undefined
    // console.log('readPost.LIkes.likeCount', readPost.dataValues.Likes[0].dataValues.likeCount) 

    // 좋아요 유무 확인
    const isLiked = readPost.dataValues.Likes.some((like) => {
      return like.dataValues.userId == readPost.dataValues.userId
    })
    readPost.isLiked = isLiked


    // 좋아요 카운트
    const likeCount = readPost.dataValues.Likes[0].dataValues.likeCount
    readPost.likeCount = likeCount
  
    return readPost
  };

  //* 게시글 수정하기
  updatePostImage = async(
    email,
    postId,
    content,
    musicTitle,
    musicUrl,
    tag,
    latitude,
    longitude,
    placeName,
    imageUrl,
    transaction
  ) => {
    // userId 찾기
    const user = await Users.findOne({
      where: { email },
      attributes: [
        'userId'
      ]
    }, {transaction});

    // update Posts
    const updatePost = await Posts.update(
      {
        content,
        musicTitle,
        musicUrl,
        tag,
        latitude,
        longitude,
        placeName,
        private: false,
      },
      {
        where: {
          postId,
          userId: user.dataValues.userId,
        },
      }, {transaction});
      
    // delete Images
    await Images.destroy({
      where: {postId}
    })

    // create Images
    const createImage = imageUrl.map(async (url) => {
      return await Images.create({
        postId: postId,
        userId: user.dataValues.userId,
        url: url
      })
    }, {transaction});

    return updatePost
  }

  //* 게시글 삭제
  deletePostImage = async(
    email,
    postId,
    transaction
  ) => {
     // userId 찾기
     const user = await Users.findOne({
      where: { email },
      attributes: [
        'userId'
      ]
    }, {transaction});

    const deletePostImage = await Posts.destroy({
      where: {[Op.and]: [{ postId }, { userId: user.dataValues.userId }]}
    }, {transaction})

    return deletePostImage
  };

    //* DB에 저장된 imageUrl 불러오기
    findUrl = async(email, postId) => {

      const user = await Users.findOne({
        where: { email },
        attributes: [
          'userId'
        ]
      });
  
      const findUrl = await Images.findAll({
        where: {[Op.and]: [{ postId }, { userId: user.dataValues.userId }]},
        attributes: [
          'imageId',
          'url'
        ]
      });
  
      return findUrl
    };

   //* 로그인 권한 유무 확인하기 
   confirmUser = async(email, postId) => {

    const user = await Users.findOne({
      where: { email },
      attributes: ['userId']
    })

    const confirmUser = await Posts.findOne({
      where: {[Op.and]: [{ postId }, { userId: user.dataValues.userId}]}
    })

    return confirmUser
   }
}

module.exports = PostRepository