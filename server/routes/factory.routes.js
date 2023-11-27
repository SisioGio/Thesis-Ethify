module.exports = (app) => {
  const factory = require("../controllers/factory.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new factory
  router.post("/", factory.create);

  // Update an factory
  router.put("/", factory.update);

  // Retrieve all factory
  router.get("/", factory.findAll);
  // Retrieve all factory
  router.get("/:companyId", factory.getCompanyFactories);

  // Delete an factory with id
  router.delete("/:id", factory.delete);

  // Delete all factorys
  router.delete("/", factory.deleteAll);

  app.use("/api/factory", router);
};
