/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const addresses = [
  {
    userId: 1,
    street: 'Rua Curitiba',
    zipCode: '69317332',
    district: 'Equatorial',
    state: 'RR',
    city: 'Boa Vista',
    number: '273A',
    complement: 'Prox. ao hospital João XXIII',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 2,
    street: 'Estrada Municipal Attílio Citton',
    zipCode: '95059850',
    district: 'Santo Antônio',
    state: 'RS',
    city: 'Caxias do Sul',
    number: '325',
    complement: 'Prox. a padaria forno nobre',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    street: 'Rua Irlanda',
    zipCode: '86046360',
    district: 'Jardim Oscavo SantosJardim Oscavo Santos',
    state: 'PR',
    city: 'Londrina',
    number: '524',
    complement: 'Prox. ao rede compras 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface) => {
    for (const address of addresses) {
      const existedUser = await queryInterface.rawSelect(
        'Addresses',
        {
          where: {
            userId: address.userId,
          },
        },
        ['id'],
      );

      if (!existedUser || existedUser.length === 0) await queryInterface.bulkInsert('Addresses', [address], {});
      else console.log('Esse usuário já possui um endereço cadastrado.');
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Addresses', addresses, {}),
};
