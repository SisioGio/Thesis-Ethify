const db = require("../models");
const CostCenter = db.costCenter;
const Op = db.Sequelize.Op;

// Create and Save a new CostCenter
exports.create = async (req, res) => {
  // Save CostCenter in the database
  try {
    await CostCenter.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the CostCenter.",
    });
  }
};

exports.getCompanyCostCenters = (req, res) => {
  const companyId = req.params.companyId;
  CostCenter.findAll({
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
          err.message || "Some error occurred while retrieving CostCenter.",
      });
    });
};
exports.findAll = (req, res) => {
  // Validate request
  CostCenter.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CostCenters.",
      });
    });
};
// Update a CostCenter by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let CostCenter = await CostCenter.update(req.body, { where: { id: id } });
    return res.send(await CostCenter.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating CostCenter with id=" + id,
    });
  }
};
// Delete a CostCenter with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  CostCenter.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "CostCenter was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete CostCenter with id=${id}. Maybe CostCenter was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete CostCenter with id=" + id,
      });
    });
};

// Delete all CostCenter from the database.
exports.deleteAll = (req, res) => {
  CostCenter.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} CostCenter were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all CostCenter.",
      });
    });
};
