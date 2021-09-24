const { Sport, Image } = require('../models');
// const log = require('../services/log.service');

const create = (data) => Sport.create(data);

const getByName = (name) => Sport.findOne({
  where: {
    name,
  },
});

const getById = (id) => Sport.findByPk(id, {
  include: [
    {
      model: Image,
      as: 'image',
    },
  ],
});

const getOnlySportById = (id) => Sport.findByPk(id);

const getAll = async (query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let sports = null;
  const include = [
    {
      model: Image,
      as: 'image',
    },
  ];

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      include,
    };
    sports = await Sport.findAndCountAll(options);

    sports.pages = Math.ceil(sports.count / pageSize);
  } else {
    sports = await Sport.findAll({ include });
  }

  return sports;
};

const update = (id, data) => Sport.update(data, {
  where: {
    id,
  },
});

const remove = (sport) => sport.destroy();

module.exports = {
  create,
  getByName,
  getById,
  getOnlySportById,
  getAll,
  update,
  remove,
};
