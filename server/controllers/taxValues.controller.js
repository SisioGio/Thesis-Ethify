const db = require("../models");
const TaxValues = db.taxValues;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");

// Create and Save a new TaxValues
exports.create = async (req, res) => {
  // Save TaxValues in the database
  try {
    const result = await sequelize.transaction(async (t) => {
      let TaxValuesObj = await TaxValues.create(req.body, { transaction: t });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the TaxValues.",
    });
  }
};
exports.findCompanyTaxValues = (req, res) => {
  // Validate request
  TaxValues.findAll({
    where: { companyId: req.params.companyId },
    include: [db.taxCode, db.customerGroup],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving TaxValuess.",
      });
    });
};
exports.findAll = (req, res) => {
  // Validate request
  TaxValues.findAll({ include: db.TaxValuessValue })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving TaxValuess.",
      });
    });
};
// Update a TaxValues by the id in the request form
exports.update = async (req, res) => {
  try {
    let taxValues = await TaxValues.update(
      { percentage: req.body.percentage },
      {
        where: {
          taxCodeId: req.body.taxCodeId,
          customerGroupId: req.body.customerGroupId,
        },
      }
    );
    return res.send(
      await TaxValues.findOne({
        where: {
          taxCodeId: req.body.taxCodeId,
          customerGroupId: req.body.customerGroupId,
        },
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating TaxValues ",
    });
  }
};
// Delete a TaxValues with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  TaxValues.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "TaxValues was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete TaxValues with id=${id}. Maybe TaxValues was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete TaxValues with id=" + id,
      });
    });
};

// Delete all TaxValues from the database.
exports.deleteAll = (req, res) => {
  TaxValues.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} TaxValues were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all TaxValues.",
      });
    });
};
