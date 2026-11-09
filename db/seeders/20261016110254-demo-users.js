'use strict';

const hosts = [
  { school_id: '24179712', full_name: 'Kakashi Hatake', email: 'hatakekakashi@example.test' },
  { school_id: '24179333', full_name: 'Tsunade Senju',  email: 'senjutsunade@example.test'  },
];

const players = [
  { school_id: '24179723', full_name: 'Hinata Hyuga',   email: 'hyugahinata@example.test'  },
  { school_id: '24179795', full_name: 'Naruto Uzumaki', email: 'naruto@example.test'       },
  { school_id: '24179111', full_name: 'Sasuke Uchiha',  email: 'uchihasasuke@example.test' },
  { school_id: '24179221', full_name: 'Sakura Haruno',  email: 'harunosakura@example.test' },
];

const rows = [
  ...hosts.map((u) => ({ ...u, role: 'host' })),
  ...players.map((u) => ({ ...u, role: 'player' })),
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      school_id: rows.map((u) => u.school_id),
    });
  },
};