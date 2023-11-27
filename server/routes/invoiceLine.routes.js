module.exports = (app) => {
  const invoiceLine = require("../controllers/invoiceLine.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Retrieve all invoiceLines
  router.get("/", invoiceLine.findAll);

  app.use("/api/invoiceLine", router);
};
