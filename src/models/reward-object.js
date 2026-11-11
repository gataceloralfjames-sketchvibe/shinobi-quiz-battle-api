module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'RewardObject',
    {
      rewardId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      rewardRoundId: { type: DataTypes.INTEGER, allowNull: false },
      objectType: { type: DataTypes.STRING(20), allowNull: false },
      chakraChange: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'RewardObject', timestamps: false }
  );