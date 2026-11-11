module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Question',
    {
      questionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      questionSetId: { type: DataTypes.INTEGER, allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.STRING(30), allowNull: false },
      correctIndex: { type: DataTypes.INTEGER, allowNull: false },
      timeLimit: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'Question', timestamps: false }
  );