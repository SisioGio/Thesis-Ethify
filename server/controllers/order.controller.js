const db = require("../models");
const Order = db.order;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");

// Create and Save a new Order
exports.create = async (req, res) => {
  // Save Order in the database
  try {
    var outputOrders = [];
    const result = await sequelize.transaction(async (t) => {
      let cart = req.body;

      if (!cart.customerId) {
        return res.code(422).send({ message: "Customer ID cannot be empty!" });
      }

      let vendors = [
        ...new Set(cart.items.map((item) => item.product.company.id)),
      ];
      var customerId = cart.customerId;

      for (let vendor of vendors) {
        let vendorItems = cart.items.filter(
          (item) => item.product.company.id === vendor
        );

        let totalAmount = vendorItems.reduce(function (prev, next) {
          return (
            prev + parseFloat(next.quantity) * parseFloat(next.product.price)
          );
        }, 0);

        var order = await Order.create(
          {
            customerId: customerId,
            vendorId: vendor,
            amount: totalAmount,
            status: "New",
          },
          { transaction: t }
        );

        outputOrders.push(order);
        for (let item of vendorItems) {
          let orderProduct = await db.orderProduct.create(
            {
              orderId: order.id,
              productId: item.product.id,
              quantity: item.quantity,
            },
            { transaction: t }
          );
        }
      }

      return res.send(outputOrders);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Order.",
    });
  }
};
exports.findSalesOrders = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    res.send(
      await Order.findAll({
        where: { vendorId: companyId },
        include: [
          { model: db.invoice },
          { model: db.company, as: "vendor", include: db.address },
          {
            model: db.company,
            as: "customer",
            include: [db.customerGroup, db.address],
          },
          {
            model: db.orderProduct,
            include: {
              model: db.product,
              include: { model: db.taxCode, include: { model: db.taxValues } },
            },
          },
        ],
      })
    );
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Orders.",
    });
  }
};
exports.findPurchaseOrders = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    res.send(
      await Order.findAll({
        where: { customerId: companyId },
        include: [
          { model: db.invoice },
          { model: db.company, as: "vendor", include: db.address },
          {
            model: db.company,
            as: "customer",
            include: [db.customerGroup, db.address],
          },
          {
            model: db.orderProduct,
            include: {
              model: db.product,
              include: { model: db.taxCode, include: { model: db.taxValues } },
            },
          },
        ],
      })
    );
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Orders.",
    });
  }
};

exports.findAll = async (req, res) => {
  // Validate request
  try {
    res.send(
      await Order.findAll({
        include: [
          { model: db.company, as: "vendor", include: db.address },
          {
            model: db.company,
            as: "customer",
            include: [db.customerGroup, db.address],
          },
          {
            model: db.orderProduct,
            include: {
              model: db.product,
              include: { model: db.taxCode, include: { model: db.taxValues } },
            },
          },
        ],
      })
    );
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Orders.",
    });
  }
};
// Update a Order by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let Order = await Order.update(req.body, { where: { id: id } });
    return res.send(await Order.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Order with id=" + id,
    });
  }
};
// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id,
      });
    });
};

// Delete all Order from the database.
exports.deleteAll = (req, res) => {
  Order.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Order were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Order.",
      });
    });
};
