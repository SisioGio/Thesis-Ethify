const db = require("../models");
const Image = db.image;
const Op = db.Sequelize.Op;

// Create and Save a new Image
exports.create = async (req, res) => {
  // Save Image in the database
  try {
    await Image.create(req.body);
    return res.send();
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Image.",
    });
  }
};


exports.findAll = (req, res) => {
  // Validate request
  Image.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Images.",
      });
    });
};
// Update a Image by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let Image = await Image.update(req.body, { where: { id: id } });
    return res.send(await Image.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Image with id=" + id,
    });
  }
};
// Delete a Image with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Image.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Image was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Image with id=${id}. Maybe Image was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Image with id=" + id,
      });
    });
};

// Delete all Image from the database.
exports.deleteAll = (req, res) => {
  Image.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Image were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Image.",
      });
    });
};
