const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;
const { sequelize, customer, customerGroup } = require("../models");
// Create and Save a new Customer
exports.create = async (req, res) => {
  // Save Customer in the database
  try {
    return res.send("NOT USED");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Customer.",
    });
  }
};
exports.getVendorCustomers = async (req, res) => {
  // Validate request
  try {
    const vendorId = req.params.vendorId;
    let data = await Customer.findAll({
      where: { vendorId: vendorId },
      include: [
        { model: db.company, as: "vendor" },
        {
          model: db.company,
          as: "referenceCustomerCompany",
          include: db.address,
        },
        { model: db.address },
        { model: db.paymentTerm },
        { model: db.customerGroup },
      ],
    });

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Customers.",
    });
  }
};
exports.findAll = (req, res) => {
  console.log("Retrieving all Customers");
  // Validate request
  Customer.findAll({
    include: [
      { model: db.company, as: "vendor" },
      {
        model: db.company,
        as: "referenceCustomerCompany",
        include: db.address,
      },
      { model: db.address },
      { model: db.paymentTerm },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Customers.",
      });
    });
};
// Update a Customer by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let customer = await Customer.update(req.body, { where: { id: id } });
    return res.send(await Customer.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Customer with id=" + id,
    });
  }
};
// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Customer was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Customer with id=" + id,
      });
    });
};

// Delete all Customer from the database.
exports.deleteAll = (req, res) => {
  Customer.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Customer were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Customer.",
      });
    });
};
