/* eslint-disable no-await-in-loop, no-console, no-restricted-syntax */

const addresses = [
  {
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
    for (const address of addresses) await queryInterface.bulkInsert('Addresses', [address], {});
  },

  down: (queryInterface) => queryInterface.bulkDelete('Addresses', addresses, {}),
};
