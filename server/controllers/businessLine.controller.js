const db = require("../models");
const BusinessLine = db.businessLine;
const Op = db.Sequelize.Op;

// Create and Save a new BusinessLine
exports.create = async (req, res) => {
  // Save BusinessLine in the database
  try {
    await BusinessLine.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the BusinessLine.",
    });
  }
};
exports.getCompanyBusinessLines = (req, res) => {
  const companyId = req.params.companyId;
  BusinessLine.findAll({
    where: {
      companyId: companyId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving BusinessLines.",
      });
    });
};

exports.findAll = (req, res) => {
  BusinessLine.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving BusinessLines.",
      });
    });
};
// Update a BusinessLine by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let BusinessLine = await BusinessLine.update(req.body, {
      where: { id: id },
    });
    return res.send(await BusinessLine.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating BusinessLine with id=" + id,
    });
  }
};
// Delete a BusinessLine with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  BusinessLine.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "BusinessLine was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete BusinessLine with id=${id}. Maybe BusinessLine was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete BusinessLine with id=" + id,
      });
    });
};

// Delete all BusinessLine from the database.
exports.deleteAll = (req, res) => {
  BusinessLine.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} BusinessLine were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all BusinessLine.",
      });
    });
};
