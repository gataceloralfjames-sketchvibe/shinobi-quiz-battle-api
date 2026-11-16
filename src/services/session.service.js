const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');

const JOIN_CODE_LENGTH = 6;
const JOIN_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // walang 0/O, 1/I

function randomJoinCode() {
  let code = '';
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    code += JOIN_CODE_CHARS[Math.floor(Math.random() * JOIN_CODE_CHARS.length)];
  }
  return code;
}

async function generateUniqueJoinCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomJoinCode();
    const existing = await sessionRepository.findByJoinCode(code);
    if (!existing) return code;
  }
  throw conflict('JOIN_CODE_UNAVAILABLE', 'Could not generate a unique join code. Try again.');
}

async function findOrFail(sessionId) {
  const session = await sessionRepository.findById(sessionId);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session has the id ${sessionId}.`);
  return session;
}

function isHost(session, user) {
  return session.hostId === user.user_id;
}

// Rule: the host is the caller, and they can only use their own question set.
async function create(data, user) {
  const questionSet = await questionSetRepository.findById(data.questionSetId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${data.questionSetId}.`);
  }
  if (questionSet.hostId !== user.user_id) {
    throw forbidden('This question set belongs to another host.');
  }
  const joinCode = await generateUniqueJoinCode();
  return sessionRepository.createSession({
    hostId: user.user_id,
    questionSetId: data.questionSetId,
    timeLimit: data.timeLimit,
    joinCode,
  });
}

// Rule: only the host or a joined player can read a session.
async function get(sessionId, user) {
  const session = await findOrFail(sessionId);
  if (!isHost(session, user)) {
    const player = await sessionRepository.findPlayer(session.sessionId, user.user_id);
    if (!player) throw forbidden('You are not part of this session.');
  }
  return session;
}

// Rule: join only while the session is waiting, and only once per user.
async function join(data, user) {
  const session = await sessionRepository.findByJoinCode(data.joinCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', 'No session has that join code.');
  if (session.status !== 'waiting') {
    throw conflict('SESSION_NOT_JOINABLE', 'This session is no longer accepting players.');
  }
  const existing = await sessionRepository.findPlayer(session.sessionId, user.user_id);
  if (existing) throw conflict('ALREADY_JOINED', 'You already joined this session.');

  return sessionRepository.addPlayer({
    sessionId: session.sessionId,
    userId: user.user_id,
    nickname: data.nickname,
    avatar: data.avatar,
  });
}

// Rule: only the host or a joined player can see the player list.
async function listPlayers(sessionId, user) {
  const session = await get(sessionId, user);
  return sessionRepository.listPlayers(session.sessionId);
}

// Rule: only the host can start, and only from waiting.
async function start(sessionId, user) {
  const session = await findOrFail(sessionId);
  if (!isHost(session, user)) throw forbidden('Only the host can start this session.');
  if (session.status !== 'waiting') {
    throw conflict('INVALID_STATUS', 'Only a waiting session can be started.');
  }
  return sessionRepository.startSession(session.sessionId);
}

// Rule: only the host can end, and only from active.
async function end(sessionId, user) {
  const session = await findOrFail(sessionId);
  if (!isHost(session, user)) throw forbidden('Only the host can end this session.');
  if (session.status !== 'active') {
    throw conflict('INVALID_STATUS', 'Only an active session can be ended.');
  }
  return sessionRepository.endSession(session.sessionId);
}

module.exports = { create, get, join, listPlayers, start, end };