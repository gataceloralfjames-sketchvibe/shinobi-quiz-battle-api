const { GameSession, Player } = require('../models');

// ---------- Session ----------
async function createSession({ hostId, questionSetId, joinCode, timeLimit }) {
  return GameSession.create({
    hostId,
    questionSetId,
    joinCode,
    timeLimit,
    status: 'waiting',
  });
}

async function findById(sessionId) {
  return GameSession.findByPk(sessionId);
}

async function findByJoinCode(joinCode) {
  return GameSession.findOne({ where: { joinCode } });
}

async function startSession(sessionId) {
  const session = await GameSession.findByPk(sessionId);
  if (!session) return null;
  return session.update({ status: 'active', startTime: new Date() });
}

async function endSession(sessionId) {
  const session = await GameSession.findByPk(sessionId);
  if (!session) return null;
  return session.update({ status: 'finished', endTime: new Date() });
}

// ---------- Player ----------
async function addPlayer({ sessionId, userId, nickname, avatar }) {
  return Player.create({
    sessionId,
    user_id: userId,
    nickname,
    avatar,
  });
}

async function findPlayer(sessionId, userId) {
  return Player.findOne({ where: { sessionId, user_id: userId } });
}

async function listPlayers(sessionId) {
  return Player.findAll({
    where: { sessionId },
    order: [['playerId', 'ASC']],
  });
}

module.exports = {
  createSession,
  findById,
  findByJoinCode,
  startSession,
  endSession,
  addPlayer,
  findPlayer,
  listPlayers,
};