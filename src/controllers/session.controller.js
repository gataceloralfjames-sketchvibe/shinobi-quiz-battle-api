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

// What a client is allowed to see of a player.
function playerToJson(player) {
  return {
    id: player.playerId,
    sessionId: player.sessionId,
    userId: player.user_id,
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
  const { id } = matchedData(req, { locations: ['params'] });
  const session = await sessionService.get(id, req.user);
  res.status(200).json(sessionToJson(session));
}

async function join(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const player = await sessionService.join(data, req.user);
  res.status(201).json(playerToJson(player));
}

async function listPlayers(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const players = await sessionService.listPlayers(id, req.user);
  res.status(200).json(players.map(playerToJson));
}

async function start(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const session = await sessionService.start(id, req.user);
  res.status(200).json(sessionToJson(session));
}

async function end(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const session = await sessionService.end(id, req.user);
  res.status(200).json(sessionToJson(session));
}

module.exports = { create, get, join, listPlayers, start, end };