'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Comments, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
      this.hasMany(models.Images, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
      this.hasMany(models.Reports, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
      this.hasMany(models.Likes, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
    }
  }
  Posts.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING(7000),
      },
      latitude: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      longitude: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      private: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Posts',
    }
  );
  return Posts;
};
