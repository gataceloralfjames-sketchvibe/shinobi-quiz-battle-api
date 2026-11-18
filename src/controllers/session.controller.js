 const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

// What a client is allowed to see of a session.
function sessionToJson(session) {
  return {
    id: session.sessionId,
    hostId: session.hostId,
    questionSetId: session.questionSetId,
    joinCode: session.joinCode,
    status: session.status,
    timeLimit: session.timeLimit,
    startTime: session.startTime,
    endTime: session.endTime,
  };
}

// What a client is allowed to see of a player: no user id, school id, name or email.
function playerToJson(player) {
  return {
    id: player.playerId,
    nickname: player.nickname,
    avatar: player.avatar,
    chakra: player.chakra,
  };
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(data, req.user);
  res.status(201).json(sessionToJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const session = await sessionService.get(code, req.user);
  res.status(200).json(sessionToJson(session));
}

async function changeStatus(req, res) {
  const { code, status } = matchedData(req, { locations: ['params', 'body'] });
  const session = await sessionService.changeStatus(code, status, req.user);
  res.status(200).json(sessionToJson(session));
}

async function join(req, res) {
  const { code, nickname, avatar } = matchedData(req, { locations: ['params', 'body'] });
  const { session, player, created } = await sessionService.join(
    code,
    { nickname, avatar },
    req.user,
  );

  // 201 Created for a new seat, 200 OK when the account already had one (rejoin).
  res.status(created ? 201 : 200).json({
    ...playerToJson(player),
    rejoined: !created,
    session: sessionToJson(session),
  });
}

async function listPlayers(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const players = await sessionService.listPlayers(code, req.user);
  res.status(200).json(players.map(playerToJson));
}

module.exports = { create, get, changeStatus, join, listPlayers };