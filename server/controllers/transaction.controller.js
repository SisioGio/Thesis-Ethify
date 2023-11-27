const db = require("../models");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");
// Create and Save a new Transaction/s

exports.create = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const companyId = req.body.companyId;
      const invoiceId = req.body.invoiceId;

      const invoiceProducts = req.body.products;

      for (let i = 0; i < invoiceProducts.length; i++) {
        var invProduct = invoiceProducts[i];
        var productId = invProduct.productId;

        for (let j = 0; j < invProduct.lines.length; j++) {
          var invProdLine = invProduct.lines[j];

          var warehouseObj = await db.warehouse.findOne({
            where: {
              externalId: productId,
            },
          });
          if (!warehouseObj) {
            warehouseObj = await db.warehouse.create({
              name: invProdLine.name,
              unitPrice: invProdLine.unitPrice,
              quantity: invProdLine.quantity,
              unitOfMeasure: invProdLine.unitOfMeasure,
              externalId: productId,
            });
          }

          invProdLine.companyId = companyId;
          invProdLine.warehouseId = warehouseObj.id;
          invProdLine.invoiceId = invoiceId;
          delete invProdLine.id;

          let transaction = await db.transaction.create(invProdLine, {
            transaction: t,
          });
        }
      }

      const invoice = await db.invoice.findByPk(invoiceId, { transaction: t });
      invoice.status = "Saved";
      await invoice.save({ transaction: t });
    });
    return res.send();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error while saving invoice data" });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Transaction.findAll({
    include: db.invoiceLine,
  })
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
    let transaction = await Transaction.update(req.body, { where: { id: id } });
    return res.send(await Transaction.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};
// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Transaction.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Transaction was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Transaction with id=" + id,
      });
    });
};

// Delete all Product from the database.
exports.deleteAll = (req, res) => {
  Transaction.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Transaction were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Product.",
      });
    });
};
