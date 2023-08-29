const { Posts, Users, Likes, Images,Comments,Reports,sequelize, Sequelize,Subscription } = require('../models');
const bcrypt = require('bcrypt');

exports.create = async (subscription, user) => {
  // User ID와 엔드포인트에 해당하는 구독 정보가 이미 존재하는지 확인합니다.
  const existingSubscription = await Subscription.findOne({
    where: {
      userId: user.userId,
      endpoint: subscription.endpoint
    }
  });

  // 이미 구독 정보가 존재한다면 새로 생성하지 않고 반환합니다.
  if (existingSubscription) {
    console.log("Subscription already exists for this user and endpoint.");
    return existingSubscription;
  }

  // 존재하지 않는다면 새 구독 정보를 생성합니다.
  subscription.userId = user.userId;
  console.log(subscription);
  return Subscription.create(subscription);
};

exports.togglePush = async(userId) => {
  // userId와 일치하는 모든 구독을 찾습니다.
  const subscriptions = await Subscription.findAll({ where: { userId: userId } });

  if (!subscriptions.length) {
    throw new Error("Subscription not found for user");
  }

  // 각 구독에 대해 receive 필드를 토글합니다.
  for (let sub of subscriptions) {
    sub.receive = !sub.receive;
    await sub.save();
  }

  return "Success";
};

exports.findOneSub = async (userId) => {
  const subscription = await Subscription.findOne({
    where: {
      userId: userId
    }
  });
  return subscription;
};

exports.findAllSub = async () => {
  const subscriptions = await Subscription.findAll(
  );

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