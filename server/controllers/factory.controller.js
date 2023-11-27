const db = require("../models");
const Factory = db.factory;
const Op = db.Sequelize.Op;

// Create and Save a new Factory
exports.create = async (req, res) => {
  // Save Factory in the database
  try {
    await Factory.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Factory.",
    });
  }
};

exports.getCompanyFactories = (req, res) => {
  const companyId = req.params.companyId;
  Factory.findAll({
    where: { companyId: companyId },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Factorys.",
      });
    });
};

exports.findAll = (req, res) => {
  // Validate request
  Factory.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Factorys.",
      });
    });
};
// Update a Factory by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let Factory = await Factory.update(req.body, { where: { id: id } });
    return res.send(await Factory.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Factory with id=" + id,
    });
  }
};
// Delete a Factory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Factory.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Factory was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Factory with id=${id}. Maybe Factory was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Factory with id=" + id,
      });
    });
};

// Delete all Factory from the database.
exports.deleteAll = (req, res) => {
  Factory.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Factory were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Factory.",
      });
    });
};
