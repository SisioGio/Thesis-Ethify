module.exports = (app) => {
  const customerGroup = require("../controllers/customerGroup.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new customerGroup
  router.post("/", customerGroup.create);

  // Update an customerGroup
  router.put("/", customerGroup.update);

  // Retrieve all customerGroup
  router.get("/", customerGroup.findAll);

  // Retrieve company tax code
  router.get("/:companyId", customerGroup.findCompanyCustomerGroups);

  // Delete an customerGroup with id
  router.delete("/:id", customerGroup.delete);

  // Delete all customerGroups
  router.delete("/", customerGroup.deleteAll);

  app.use("/api/customerGroup", router);
};
