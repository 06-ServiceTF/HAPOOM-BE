'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // 가정: 사용자 정보가 'Users' 테이블에 저장되어 있다고 가정합니다.
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      receive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // 기본적으로는 알림 수신을 허용한다고 가정
      },
      endpoint: {
        type: Sequelize.STRING,
      },
      expirationTime: {
        type: Sequelize.STRING,
      },
      keys: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Subscriptions');
  },
};