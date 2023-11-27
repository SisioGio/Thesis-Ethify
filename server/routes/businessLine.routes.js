module.exports = (app) => {
  const businessLine = require("../controllers/businessLine.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new businessLine
  router.post("/", businessLine.create);

  // Update an businessLine
  router.put("/", businessLine.update);

  // Retrieve all businessLine
  router.get("/", businessLine.findAll);
  // Retrieve all businessLine
  router.get("/:companyId", businessLine.getCompanyBusinessLines);

  // Delete an businessLine with id
  router.delete("/:id", businessLine.delete);

  // Delete all businessLines
  router.delete("/", businessLine.deleteAll);

  app.use("/api/businessLine", router);
};
