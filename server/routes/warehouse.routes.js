module.exports = (app) => {
  const warehouse = require("../controllers/warehouse.controller.js");
  const { authJwt } = require("../middleware/index.js");
  var router = require("express").Router();

  // Retrieve all warehouse
  router.get("/", warehouse.findAll);

  app.use("/api/warehouse", router);
};
