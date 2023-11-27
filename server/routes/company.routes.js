module.exports = (app) => {
  const company = require("../controllers/company.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new company
  router.post("/", company.create);

  // Get entity KPIS
  router.get("/kpi/:companyId", company.getEntityKpis);

  // Update an company
  router.put("/", company.update);
  // Retrieve user companies
  router.get("/:userId", company.findUserCompanies);

  // Retrieve company product
  router.get("/products/:companyId", company.findCompanyProducts);
  // Retrieve all company
  router.get("/", company.findAll);

  // Delete an company with id
  router.delete("/:id", company.delete);

  // Delete all companys
  router.delete("/", company.deleteAll);

  app.use("/api/company", router);
};
