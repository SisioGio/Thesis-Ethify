module.exports = (app) => {
  const customer = require("../controllers/customer.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new customer
  router.post("/", customer.create);

  // Update an customer
  router.put("/", customer.update);

  // Retrieve all customer
  router.get("/", customer.findAll);
  // Retrieve all customer
  router.get(`/:vendorId`, customer.getVendorCustomers);

  // Delete an customer with id
  router.delete("/:id", customer.delete);

  // Delete all customers
  router.delete("/", customer.deleteAll);

  app.use("/api/customer", router);
};
