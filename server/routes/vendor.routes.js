module.exports = (app) => {
  const vendor = require("../controllers/vendor.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new vendor
  router.post("/", vendor.create);

  // Update an vendor
  router.put("/", vendor.update);

  // Retrieve all vendor
  router.get("/", vendor.findAll);
  // Retrieve customer vendors
  router.get("/:customerId", vendor.getCustomerVendors);
  // Delete an vendor with id
  router.delete("/:id", vendor.delete);

  // Delete all vendors
  router.delete("/", vendor.deleteAll);

  app.use("/api/vendor", router);
};
