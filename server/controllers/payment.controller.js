const db = require("../models");
const Payment = db.payment;
const Op = db.Sequelize.Op;

// Create and Save a new Payment
exports.create = async (req, res) => {
  // Save Payment in the database
  try {
    const transactionHash = req.body.transactionHash;
    const transactionAmount = req.body.transactionAmount;
    const invoices = req.body.invoices;

    const paymentObj = await Payment.create({
      transactionHash: transactionHash,
      amount: transactionAmount,
    });

    for (var i = 0; i < invoices.length; i++) {
      var invoiceObj = await db.invoice.findByPk(invoices[i].id);
      invoiceObj.paid = true;
      invoiceObj.paymentId = paymentObj.id;
      await invoiceObj.save();
    }

    return res.send("Hello");
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Payment.",
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Payment.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Payments.",
      });
    });
};
// Update a Payment by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let Payment = await Payment.update(req.body, { where: { id: id } });
    return res.send(await Payment.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Payment with id=" + id,
    });
  }
};
// Delete a Payment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Payment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Payment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Payment with id=${id}. Maybe Payment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Payment with id=" + id,
      });
    });
};

// Delete all Payment from the database.
exports.deleteAll = (req, res) => {
  Payment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Payment were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Payment.",
      });
    });
};
