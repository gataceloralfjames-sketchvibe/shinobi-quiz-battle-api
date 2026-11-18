
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GameSession', {
      sessionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      hostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      questionSetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'QuestionSet',
          key: 'questionSetId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      joinCode: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      timeLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
        await queryInterface.addConstraint('GameSession', {
      fields: ['joinCode'],
      type: 'unique',
      name: 'uq_game_session_join_code',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('GameSession');
  },
};