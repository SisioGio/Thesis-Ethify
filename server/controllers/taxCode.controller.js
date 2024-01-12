const db = require("../models");
const TaxCode = db.taxCode;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");

// Create and Save a new TaxCode
exports.create = async (req, res) => {
  // Save TaxCode in the database
  try {
    const result = await sequelize.transaction(async (t) => {
      const taxCode = req.body.code;
      let taxCodeObj = await db.taxCode.create(
        {
          code: taxCode.toUpperCase(),
          name: req.body.name,
          companyId: req.body.companyId,
        },
        { transaction: t }
      );
      let customerGroups = await db.customerGroup.findAll(
        {
          where: { companyId: req.body.companyId },
        },
        { transaction: t }
      );

      for (let i = 0; i < customerGroups.length; i++) {
        await db.taxValues.findOrCreate({
          where: {
            taxCodeId: taxCodeObj.id,
            customerGroupId: customerGroups[i].id,
            companyId: req.body.companyId,
            name:
              req.body.code.toUpperCase() + " (" + customerGroups[i].name + ")",
          },
          transaction: t,
        });
      }
      return res.send(taxCodeObj);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the TaxCode.",
    });
  }
};

exports.findCompanyTaxCodes = (req, res) => {
  const companyId = req.params.companyId;

  // Validate request
  db.taxCode
    .findAll({ where: { companyId: companyId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving TaxCodes.",
      });
    });
};

exports.findAll = (req, res) => {
  // Validate request
  TaxCode.findAll({ include: db.taxCodesValue })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving TaxCodes.",
      });
    });
};
// Update a TaxCode by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let TaxCode = await TaxCode.update(req.body, { where: { id: id } });
    return res.send(await TaxCode.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating TaxCode with id=" + id,
    });
  }
};
// Delete a TaxCode with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  TaxCode.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "TaxCode was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete TaxCode with id=${id}. Maybe TaxCode was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete TaxCode with id=" + id,
      });
    });
};

// Delete all TaxCode from the database.
exports.deleteAll = (req, res) => {
  TaxCode.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} TaxCode were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all TaxCode.",
      });
    });
};
