const db = require("../models");
const InvoiceLine = db.invoiceLine;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  // Validate request
  InvoiceLine.findAll({
    include: db.orderProduct,
  })
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
