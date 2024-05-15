const { Users } = require("./models");

const getAll = async (request, response) => {
  try {
    const result = await Users.findAll();
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

const getById = async (request, response) => {
  const { id } = request.params;

  try {
    const result = await Users.findOne({ where: { id } });
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

const create = async (request, response) => {
  const fieldsNames = [
    "name",
    "username",
    "email",
    "date",
    "dateOfBirth",
    "location",
    "gender",
  ];

  const fields = {};

  // Adding a default value
  for (const name of fieldsNames) {
    fields[name] = request.body[name] || "";
  }

  try {
    const result = await Users.create(fields);
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

const deleteById = async (request, response) => {
  const { id } = request.params;

  try {
    const result = Users.destroy({ where: { id } });
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
};
