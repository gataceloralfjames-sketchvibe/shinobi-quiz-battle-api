module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Player',
    {
      playerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sessionId: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      nickname: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING },
      chakra: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'Player', timestamps: false }
  );