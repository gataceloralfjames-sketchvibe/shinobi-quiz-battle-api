module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'RewardRound',
    {
      rewardRoundId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      playerId: { type: DataTypes.INTEGER, allowNull: false },
      duration: { type: DataTypes.INTEGER, allowNull: false },
      chakraEarned: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'RewardRound', timestamps: false }
  );