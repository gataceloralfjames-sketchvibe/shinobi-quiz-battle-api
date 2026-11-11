module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Answer',
    {
      answerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      playerId: { type: DataTypes.INTEGER, allowNull: false },
      questionId: { type: DataTypes.INTEGER, allowNull: false },
      selectedIndex: { type: DataTypes.INTEGER, allowNull: false },
      isCorrect: { type: DataTypes.BOOLEAN, allowNull: false },
      submittedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { tableName: 'Answer', timestamps: false }
  );