const db = require("../models");
const Address = db.address;
const Op = db.Sequelize.Op;

// Create and Save a new Address
exports.create = async (req, res) => {
  // Save Address in the database
  try {
    await Address.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the address.",
    });
  }
};
// Update a Address by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let address = await Address.update(req.body, { where: { id: id } });
    return res.send(await Address.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Address with id=" + id,
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Address.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Addresss.",
      });
    });
};

// Delete a Address with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Address.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Address was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Address with id=${id}. Maybe Address was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Address with id=" + id,
      });
    });
};

// Delete all Address from the database.
exports.deleteAll = (req, res) => {
  Address.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Address were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Address.",
      });
    });
};
