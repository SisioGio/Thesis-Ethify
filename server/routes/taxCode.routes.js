module.exports = (app) => {
  const taxCode = require("../controllers/taxCode.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new taxCode
  router.post("/", taxCode.create);

  // Update an taxCode
  router.put("/", taxCode.update);

  // Retrieve all taxCode
  router.get("/", taxCode.findAll);

  // Retrieve company tax code
  router.get("/:companyId", taxCode.findCompanyTaxCodes);

  // Delete an taxCode with id
  router.delete("/:id", taxCode.delete);

  // Delete all taxCodes
  router.delete("/", taxCode.deleteAll);

  app.use("/api/taxCode", router);
};
