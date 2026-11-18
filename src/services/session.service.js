 const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');

// Check the status enum in db/migrations/20261016103721-create-GameSession.js
// and match these three names to it. This is the only place you need to change.
const STATUS = { WAITING: 'waiting', ACTIVE: 'active', ENDED: 'finished' };

const NEXT_STATUS = {
  [STATUS.WAITING]: [STATUS.ACTIVE, STATUS.ENDED],
  [STATUS.ACTIVE]: [STATUS.ENDED],
  [STATUS.ENDED]: [],
};
const DEFAULT_TIME_LIMIT = 30; // change this to match your game's rule and unit
const DEFAULT_AVATAR = 'default'; // change this to a value your game accepts
const JOIN_CODE_LENGTH = 6;
const JOIN_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I

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

// Looks up by join code now, not by id.
async function findOrFail(joinCode) {
  const session = await sessionRepository.findByJoinCode(joinCode);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session has the code ${joinCode}.`);
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
    timeLimit: data.timeLimit ?? DEFAULT_TIME_LIMIT,
    joinCode,
  });
}

// Rule: only the host or a joined player can read a session.
async function get(code, user) {
  const session = await findOrFail(code);
  if (!isHost(session, user)) {
    const player = await sessionRepository.findPlayer(session.sessionId, user.user_id);
    if (!player) throw forbidden('You are not part of this session.');
  }
  return session;
}

// Rule: join or rejoin. The seat check comes first, then the status check.
async function join(code, data, user) {
  const session = await findOrFail(code);

  // Rejoin: this account already has a seat, so return the same row.
  const seat = await sessionRepository.findPlayer(session.sessionId, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // New seat: only while the session is waiting.
  if (session.status === STATUS.ENDED) throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== STATUS.WAITING) {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }
  const player = await sessionRepository.addPlayer({
    sessionId: session.sessionId,
    userId: user.user_id,
    nickname: data.nickname,
    avatar: data.avatar ?? DEFAULT_AVATAR,
  });
  return { session, player, created: true };
}

// Rule: only the host or a joined player can see the player list.
async function listPlayers(code, user) {
  const session = await get(code, user);
  return sessionRepository.listPlayers(session.sessionId);
}

// Rule: only the host changes the status, and only to an allowed next status.
async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (!isHost(session, user)) throw forbidden('Only the host can change this session.');
  if (!NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} session cannot become ${status}.`);
  }
  return status === STATUS.ACTIVE
    ? sessionRepository.startSession(session.sessionId)
    : sessionRepository.endSession(session.sessionId);
}

module.exports = { create, get, join, listPlayers, changeStatus };