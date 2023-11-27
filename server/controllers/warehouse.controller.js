const db = require("../models");
const Warehouse = db.warehouse;
const Op = db.Sequelize.Op;
const { sequelize, customer } = require("../models");

exports.findAll = (req, res) => {
  Warehouse.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Vendors.",
      });
    });
};
