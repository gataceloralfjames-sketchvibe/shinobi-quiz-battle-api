'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Question', {
      questionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      correctIndex: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      timeLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Question');
  }
};