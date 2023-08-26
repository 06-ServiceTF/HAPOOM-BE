const { Posts, Users, Likes, Images,Comments,Reports,sequelize, Sequelize,Subscription } = require('../models');
const bcrypt = require('bcrypt');

exports.create = (subscription) => {
  return Subscription.create(subscription);
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