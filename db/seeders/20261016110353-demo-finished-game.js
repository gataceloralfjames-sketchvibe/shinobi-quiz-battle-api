'use strict';

const { Op } = require('sequelize');

// school_id values created by the demo-users seeder
const HOST_SCHOOL_ID = '24179712';
const PLAYER_SCHOOL_IDS = ['24179723', '24179795', '24179111', '24179333'];

// How many of the five questions each player answered (player 4 left early)
const ANSWERS_PER_PLAYER = { 1: 5, 2: 5, 3: 5, 4: 2 };

async function findUserId(db, schoolId) {
  const [rows] = await db.query(
    'SELECT user_id FROM users WHERE school_id = :schoolId',
    { replacements: { schoolId } },
  );
  return rows.length ? rows[0].user_id : null;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const hostId = await findUserId(db, HOST_SCHOOL_ID);
    const playerUserIds = [];
    for (const schoolId of PLAYER_SCHOOL_IDS) {
      playerUserIds.push(await findUserId(db, schoolId));
    }

    if (hostId === null || playerUserIds.some((id) => id === null)) {
      throw new Error('Run the demo-users seeder before this seeder.');
    }

    await queryInterface.bulkInsert('QuestionSet', [
      {
        questionSetId: 1,
        hostId,
        title: 'Shinobi Basics',
        subject: 'General Knowledge',
      },
    ]);

    // Session 1 is finished; session 2 is still waiting for players
    await queryInterface.bulkInsert('GameSession', [
      {
        sessionId: 1,
        hostId,
        questionSetId: 1,
        joinCode: '418263',
        status: 'CLOSED',
        timeLimit: 600,
        startTime: new Date('2026-10-10T01:00:00Z'),
        endTime: new Date('2026-10-10T01:10:00Z'),
      },
      {
        sessionId: 2,
        hostId,
        questionSetId: 1,
        joinCode: '527194',
        status: 'WAITING',
        timeLimit: 600,
        startTime: null,
        endTime: null,
      },
    ]);

    // Three players finished; "EarlyExit" left partway through
    const playerProfiles = [
      { nickname: 'LeafOne',   avatar: 'naruto', chakra: 35 },
      { nickname: 'LeafTwo',   avatar: 'sakura', chakra: 25 },
      { nickname: 'LeafThree', avatar: 'sasuke', chakra: 15 },
      { nickname: 'EarlyExit', avatar: 'kakashi', chakra: 10 },
    ];

    await queryInterface.bulkInsert(
      'Player',
      playerProfiles.map((profile, i) => ({
        playerId: i + 1,
        sessionId: 1,
        user_id: playerUserIds[i],
        ...profile,
      })),
    );

    const questionDefs = [
      ['What is the main character energy called in this game?', 0],
      ['How long is the game session in minutes?', 0],
      ['How many seconds does a reward round last?', 0],
      ['Which object gives +25 Chakra?', 1],
      ['What is the rank of the first-place player?', 0],
    ];

    await queryInterface.bulkInsert(
      'Question',
      questionDefs.map(([text, correctIndex], i) => ({
        questionId: i + 1,
        questionSetId: 1,
        text,
        type: 'multiple-choice',
        correctIndex,
        timeLimit: 20,
      })),
    );

    // Every submitted answer is correct (index 0), all at the same timestamp
    const submittedAt = new Date('2026-10-10T01:01:00Z');
    const answers = [];
    Object.entries(ANSWERS_PER_PLAYER).forEach(([playerId, count]) => {
      for (let q = 1; q <= count; q += 1) {
        answers.push({
          answerId: answers.length + 1,
          playerId: Number(playerId),
          questionId: q,
          selectedIndex: 0,
          isCorrect: true,
          submittedAt,
        });
      }
    });

    await queryInterface.bulkInsert('Answer', answers);

    // Reward rounds for the three players who finished
    await queryInterface.bulkInsert('RewardRound', [
      { rewardRoundId: 1, playerId: 1, duration: 5, chakraEarned: 25 },
      { rewardRoundId: 2, playerId: 2, duration: 5, chakraEarned: 15 },
      { rewardRoundId: 3, playerId: 3, duration: 5, chakraEarned: 10 },
    ]);

    await queryInterface.bulkInsert('RewardObject', [
      { rewardId: 1, rewardRoundId: 1, objectType: 'chest',   chakraChange: 25 },
      { rewardId: 2, rewardRoundId: 2, objectType: 'balloon', chakraChange: 10 },
      { rewardId: 3, rewardRoundId: 3, objectType: 'bomb',    chakraChange: -10 },
    ]);
  },

  async down(queryInterface) {
    // Delete in reverse order of insertion so foreign keys stay satisfied
    await queryInterface.bulkDelete('RewardObject', { rewardRoundId: [1, 2, 3] }, {});
    await queryInterface.bulkDelete('RewardRound', { rewardRoundId: [1, 2, 3] }, {});
    await queryInterface.bulkDelete('Answer', { answerId: { [Op.between]: [1, 17] } }, {});
    await queryInterface.bulkDelete('Question', { questionId: [1, 2, 3, 4, 5] }, {});
    await queryInterface.bulkDelete('Player', { playerId: [1, 2, 3, 4] }, {});
    await queryInterface.bulkDelete('GameSession', { sessionId: [1, 2] }, {});
    await queryInterface.bulkDelete('QuestionSet', { questionSetId: 1 }, {});
  },
};