'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'followerId',
        as: 'Follower',
      });
      this.belongsTo(models.Users, {
        foreignKey: 'followingId',
        as: 'Following',
      });
    }
  }
  Follows.init(
    {
      followId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      followerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      followingId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: 'Follows',
    }
  );
  return Follows;
};
