const db = require("../models");
const CustomerGroup = db.customerGroup;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");

// Create and Save a new CustomerGroup
exports.create = async (req, res) => {
  // Save CustomerGroup in the database
  try {
    const result = await sequelize.transaction(async (t) => {
      const customerGroupCode = req.body.code;
      let customerGroupObj = await CustomerGroup.create(
        {
          code: customerGroupCode.toUpperCase(),
          name: req.body.name,
          companyId: req.body.companyId,
        },
        { transaction: t }
      );

      let companyTaxCodes = await db.taxCode.findAll(
        {
          where: { companyId: req.body.companyId },
        },
        { transaction: t }
      );

      for (let i = 0; i < companyTaxCodes.length; i++) {
        await db.taxValues.findOrCreate({
          where: {
            taxCodeId: companyTaxCodes[i].id,
            customerGroupId: customerGroupObj.id,
            companyId: req.body.companyId,
            name: companyTaxCodes[i].name + " (" + customerGroupObj.name + ")",
          },
          transaction: t,
        });
      }

      return res.send();
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the CustomerGroup.",
    });
  }
};

exports.findCompanyCustomerGroups = (req, res) => {
  const companyId = req.params.companyId;

  // Validate request
  CustomerGroup.findAll({ where: { companyId: companyId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CustomerGroups.",
      });
    });
};

exports.findAll = (req, res) => {
  // Validate request
  CustomerGroup.findAll({ include: db.CustomerGroupsValue })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CustomerGroups.",
      });
    });
};
// Update a CustomerGroup by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let CustomerGroup = await CustomerGroup.update(req.body, {
      where: { id: id },
    });
    return res.send(await CustomerGroup.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating CustomerGroup with id=" + id,
    });
  }
};
// Delete a CustomerGroup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  CustomerGroup.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "CustomerGroup was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete CustomerGroup with id=${id}. Maybe CustomerGroup was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete CustomerGroup with id=" + id,
      });
    });
};

// Delete all CustomerGroup from the database.
exports.deleteAll = (req, res) => {
  CustomerGroup.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} CustomerGroup were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all CustomerGroup.",
      });
    });
};
