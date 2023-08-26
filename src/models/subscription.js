'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'SET NULL',
      });
    }
  }
  Subscription.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users', // 가정: 사용자 정보가 'Users' 테이블에 저장되어 있다고 가정합니다.
          key: 'userId',
        },
      },
      receive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      endpoint: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expirationTime: DataTypes.STRING,
      keys: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Subscription',
    }
  );
  return Subscription;
};
