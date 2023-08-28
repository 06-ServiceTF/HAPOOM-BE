const { Posts, Users, Likes, Images,Comments,Reports,sequelize, Sequelize,Subscription } = require('../models');
const bcrypt = require('bcrypt');

exports.create = (subscription, user) => {
  subscription.userId = user.id;
  return Subscription.create(subscription);
};

exports.togglePush = async(userId) => {
  // userId와 일치하는 구독을 찾습니다.
  const subscription = await Subscription.findOne({ where: { userId: userId } });

  if (!subscription) {
    throw new Error("Subscription not found for user");
  }

  // receive 필드를 토글합니다.
  subscription.receive = !subscription.receive;

  // 변경 사항을 데이터베이스에 저장합니다.
  await subscription.save();

  return "Success";
};

exports.findAll = async () => {
  const subscriptions = await Subscription.findAll();
  const uniqueSubscriptions = [];

  // Endpoint를 기준으로 중복을 제거
  const endpoints = new Set();
  subscriptions.forEach(sub => {
    if (!endpoints.has(sub.endpoint)) {
      uniqueSubscriptions.push(sub);
      endpoints.add(sub.endpoint);
    }
  });

  return uniqueSubscriptions;
};