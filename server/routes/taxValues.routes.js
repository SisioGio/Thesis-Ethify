module.exports = (app) => {
  const taxValues = require("../controllers/taxValues.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new taxValues
  router.post("/", taxValues.create);

  // Update an taxValues
  router.put("/", taxValues.update);

  // Retrieve all taxValues
  router.get("/", taxValues.findAll);
  // Retrieve company tax values
  router.get("/:companyId", taxValues.findCompanyTaxValues);

  // Delete an taxValues with id
  router.delete("/:id", taxValues.delete);

  // Delete all taxValuess
  router.delete("/", taxValues.deleteAll);

  app.use("/api/taxValues", router);
};
