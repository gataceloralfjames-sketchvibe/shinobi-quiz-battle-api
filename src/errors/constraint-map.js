 module.exports = {
  // Two players in the same game picked the same nickname
  uq_player_session_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },

  // One seat per account per game (a fallback; the service handles rejoin first)
  uq_player_session_user: {
    status: 409,
    code: 'ALREADY_JOINED',
    message: 'This account already has a seat in this game.',
  },

  // Two games got the same join code at the same instant (a fallback; the service retries)
  uq_game_session_join_code: {
    status: 409,
    code: 'JOIN_CODE_TAKEN',
    message: 'That join code is already in use. Please try again.',
  },

  // The question set was already used in a game, so it cannot be deleted
  GameSession_questionSetId_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },

  // The question set still has questions, so it cannot be deleted
  Question_questionSetId_fkey: {
    status: 409,
    code: 'QUESTION_SET_HAS_QUESTIONS',
    message: 'Delete the questions of this set first.',
  },
};