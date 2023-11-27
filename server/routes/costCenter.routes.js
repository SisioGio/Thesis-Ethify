module.exports = (app) => {
  const costCenter = require("../controllers/costCenter.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new costCenter
  router.post("/", costCenter.create);

  // Update an costCenter
  router.put("/", costCenter.update);

  // Retrieve all costCenter
  router.get("/", costCenter.findAll);

  // Retrieve all costCenter
  router.get("/:companyId", costCenter.getCompanyCostCenters);

  // Delete an costCenter with id
  router.delete("/:id", costCenter.delete);

  // Delete all costCenters
  router.delete("/", costCenter.deleteAll);

  app.use("/api/costCenter", router);
};
