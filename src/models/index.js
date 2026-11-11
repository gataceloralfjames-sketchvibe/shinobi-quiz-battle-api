// ONE Sequelize instance (one connection pool) for the whole app.
// Every other file imports it from here.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);
const RewardRound = require('./reward-round')(sequelize, DataTypes);
const RewardObject = require('./reward-object')(sequelize, DataTypes);

// Associations = the relationship lines of the ERD, read in both directions.S
 
User.hasMany(QuestionSet, { foreignKey: 'hostId' });
QuestionSet.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

User.hasMany(GameSession, { foreignKey: 'hostId' });
GameSession.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

QuestionSet.hasMany(GameSession, { foreignKey: 'questionSetId' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'questionSetId' });

QuestionSet.hasMany(Question, { foreignKey: 'questionSetId' });
Question.belongsTo(QuestionSet, { foreignKey: 'questionSetId' });

GameSession.hasMany(Player, { foreignKey: 'sessionId' });
Player.belongsTo(GameSession, { foreignKey: 'sessionId' });

User.hasMany(Player, { foreignKey: 'user_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

Player.hasMany(Answer, { foreignKey: 'playerId' });
Answer.belongsTo(Player, { foreignKey: 'playerId' });

Question.hasMany(Answer, { foreignKey: 'questionId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

Player.hasMany(RewardRound, { foreignKey: 'playerId' });
RewardRound.belongsTo(Player, { foreignKey: 'playerId' });

RewardRound.hasMany(RewardObject, { foreignKey: 'rewardRoundId' });
RewardObject.belongsTo(RewardRound, { foreignKey: 'rewardRoundId' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  GameSession,
  Player,
  Player,
  Question,
  Answer,
  RewardRound,
  RewardObject,
};