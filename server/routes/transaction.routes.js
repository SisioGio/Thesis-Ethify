module.exports = (app) => {
  const transaction = require("../controllers/transaction.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new transaction
  router.post("/", transaction.create);

  // Update an transaction
  router.put("/", transaction.update);

  // Retrieve all transaction
  router.get("/", transaction.findAll);

  // Delete an transaction with id
  router.delete("/:id", transaction.delete);

  // Delete all transactions
  router.delete("/", transaction.deleteAll);

  app.use("/api/transactions", router);
};
