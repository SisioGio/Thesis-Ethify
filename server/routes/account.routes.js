module.exports = (app) => {
  const account = require("../controllers/account.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new account
  router.post("/", account.create);

  // Update an account
  router.put("/", account.update);

  // Retrieve all account
  router.get("/", account.findAll);

  // Retrieve all account
  router.get("/:companyId", account.getCompanyAccounts);

  // Delete an account with id
  router.delete("/:id", account.delete);

  // Delete all accounts
  router.delete("/", account.deleteAll);

  app.use("/api/account", router);
};
