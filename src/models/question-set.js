module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      questionSetId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      hostId: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      subject: { type: DataTypes.STRING },
    },
    { tableName: 'QuestionSet', timestamps: false }
  );