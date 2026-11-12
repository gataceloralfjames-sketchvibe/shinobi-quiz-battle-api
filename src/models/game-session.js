    module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      sessionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      hostId: { type: DataTypes.INTEGER, allowNull: false },
      questionSetId: { type: DataTypes.INTEGER, allowNull: false },
      joinCode: { type: DataTypes.STRING(6), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false },
      timeLimit: { type: DataTypes.INTEGER },
      startTime: { type: DataTypes.DATE },
      endTime: { type: DataTypes.DATE },
    },
    { tableName: 'GameSession', timestamps: false }
  );