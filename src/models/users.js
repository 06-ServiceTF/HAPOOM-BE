'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Posts, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });
      this.hasMany(models.Comments, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });
      this.hasMany(models.Images, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });
      this.hasMany(models.Likes, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });
      this.hasMany(models.Reports, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      userImage: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      method: {
        allowNull: true,
        type: DataTypes.boolean,
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
      modelName: 'Users',
    }
  );
  return Users;
};
