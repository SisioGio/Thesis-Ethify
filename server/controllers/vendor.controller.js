const db = require("../models");
const Vendor = db.vendor;
const Op = db.Sequelize.Op;
const { sequelize, customer } = require("../models");
// Create and Save a new Vendor
exports.create = async (req, res) => {
  // Save Vendor in the database
  try {
    const result = await sequelize.transaction(async (t) => {
      let payLoad = req.body;
      const referenceVendorCompanyId = req.body.referenceVendorCompanyId;
      let vendor;

      let customerId = req.body.customerId;

      vendor = await Vendor.create(
        {
          referenceVendorCompanyId: referenceVendorCompanyId,
          customerId: req.body.customerId,
        },
        { transaction: t }
      );
      let customer = await db.customer.create({
        vendorId: referenceVendorCompanyId,
        referenceCustomerCompanyId: req.body.customerId,
      });

      let paymentTerms = await db.paymentTerm.create(
        {
          type: req.body.type,
          days: req.body.days,
          customerId: customer.id,
          vendorId: vendor.id,
        },
        { transaction: t }
      );

      return res.send(vendor);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Vendor.",
    });
  }
};
exports.getCustomerVendors = async (req, res) => {
  // Validate request
  try {
    const customerId = req.params.customerId;
    let data = await Vendor.findAll({
      where: { customerId: customerId },
      include: [
        { model: db.company, as: "customer" },
        {
          model: db.company,
          as: "referenceVendorCompany",
          include: db.address,
        },
        { model: db.address },
        { model: db.paymentTerm },
      ],
    });

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Vendors.",
    });
  }
};
exports.findAll = (req, res) => {
  console.log("Retrieving all vendors");
  // Validate request
  Vendor.findAll({
    include: [
      { model: db.company, as: "customer" },
      { model: db.company, as: "referenceVendorCompany", include: db.address },
      { model: db.address },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Vendors.",
      });
    });
};
// Update a Vendor by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  try {
    let Vendor = await Vendor.update(req.body, { where: { id: id } });
    return res.send(await Vendor.findByPk(id));
  } catch (err) {
    res.status(500).send({
      message: "Error updating Vendor with id=" + id,
    });
  }
};
// Delete a Vendor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Vendor.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Vendor was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Vendor with id=${id}. Maybe Vendor was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Vendor with id=" + id,
      });
    });
};

// Delete all Vendor from the database.
exports.deleteAll = (req, res) => {
  Vendor.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Vendor were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Vendor.",
      });
    });
};
