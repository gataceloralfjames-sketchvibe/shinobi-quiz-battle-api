'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Answer', {
      answerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,

        allowNull: false,
      },
      playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Player',
          key: 'playerId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Question',
          key: 'questionId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      selectedIndex: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Answer');
  }
};