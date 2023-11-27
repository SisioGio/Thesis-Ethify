const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = async (req, res) => {
  // Save Product in the database
  try {
    await Product.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Product.",
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Product.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products.",
      });
    });
};
// Update a Product by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let product = await Product.update(req.body, { where: { id: id } });
    return res.send(await Product.findByPk(id));
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};
// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id,
      });
    });
};

// Delete all Product from the database.
exports.deleteAll = (req, res) => {
  Product.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Product were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Product.",
      });
    });
};
