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
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        targetKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Comments, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
      this.hasMany(models.Images, {
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
      this.hasMany(models.Records, {
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
      this.belongsToMany(models.Tags, {
        through: 'Mappings',
        foreignKey: 'postId'
      })
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
      content: {
        type: DataTypes.STRING(7000),
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
      private: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      musicType: {
        type: DataTypes.INTEGER
      },
      musicTitle: {
        type: DataTypes.STRING
      },
      musicUrl: {
        type: DataTypes.STRING
      },
      placeName: {
        type: DataTypes.STRING
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
