/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const bcrypt = require('bcryptjs');

const users = [
  {
    addressId: 1,
    name: 'Master',
    lastName: '',
    email: 'master@email.com',
    phoneNumber: '0000000',
    passwordHash: 'master159753',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    addressId: 2,
    name: 'Jake',
    lastName: 'The Dog',
    email: 'jake_the_dog@gmail.com',
    phoneNumber: '83987900856',
    passwordHash: '123jake',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    addressId: 3,
    name: 'Marceline',
    lastName: 'Abadeer',
    email: 'Marceline_the_vampire_queen@gmail.com',
    phoneNumber: '(83)987900856',
    passwordHash: '123marcy',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const user of users) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 5);

      const existedUser = await queryInterface.rawSelect(
        'Users',
        {
          where: {
            email: user.email,
          },
        },
        ['id'],
      );

      if (!existedUser || existedUser.length === 0) await queryInterface.bulkInsert('Users', [user], {});
      else console.log(`usuario com o email '${user.email}' já existe`);
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', users, {}),
};
