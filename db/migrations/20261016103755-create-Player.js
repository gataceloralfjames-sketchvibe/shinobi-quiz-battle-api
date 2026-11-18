
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Player', {
      playerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GameSession',
          key: 'sessionId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      chakra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addConstraint('Player', {
      fields: ['sessionId', 'nickname'],
      type: 'unique',
      name: 'uq_player_session_nickname',
    });

    await queryInterface.addConstraint('Player', {
      fields: ['sessionId', 'user_id'],
      type: 'unique',
      name: 'uq_player_session_user',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Player');
  },
};