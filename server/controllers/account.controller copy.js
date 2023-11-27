const db = require("../models");
const Account = db.account;
const Op = db.Sequelize.Op;

// Create and Save a new Account
exports.create = async (req, res) => {
  // Save Account in the database
  try {
    await Account.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Account.",
    });
  }
};
exports.getCompanyAccounts = (req, res) => {
  const companyId = req.params.companyId;
  Account.findAll({
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
          err.message || "Some error occurred while retrieving Accounts.",
      });
    });
};

exports.findAll = (req, res) => {
  // Validate request
  Account.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Accounts.",
      });
    });
};
// Update a Account by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let Account = await Account.update(req.body, { where: { id: id } });
    return res.send(await Account.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Account with id=" + id,
    });
  }
};
// Delete a Account with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Account.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Account with id=${id}. Maybe Account was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Account with id=" + id,
      });
    });
};

// Delete all Account from the database.
exports.deleteAll = (req, res) => {
  Account.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Account were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Account.",
      });
    });
};
