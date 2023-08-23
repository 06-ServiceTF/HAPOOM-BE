'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId'
        },
        onDelete: 'CASCADE'
      },
      content: {
        // allowNull: false,
        type: Sequelize.STRING(7000),
      },
      latitude: {
        // allowNull: false,
        type: Sequelize.FLOAT,
      },
      longitude: {
        // allowNull: false,
        type: Sequelize.FLOAT,
      },
      private: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      placeName: {
        type: Sequelize.STRING(100)
      },
      // tag: {
      //   type: Sequelize.STRING(100)
      // },
      musicType: {
        type: Sequelize.INTEGER
      },
      musicTitle: {
        type: Sequelize.STRING(100)
      },
      musicUrl: {
        type: Sequelize.STRING(200)
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
    await queryInterface.dropTable('Posts');
  },
};
