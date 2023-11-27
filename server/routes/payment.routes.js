module.exports = (app) => {
  const payment = require("../controllers/payment.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new payment
  router.post("/", payment.create);

  
  // Update an payment
  router.put("/", payment.update);

  // Retrieve all payment
  router.get("/",  payment.findAll);

  // Delete an payment with id
  router.delete("/:id", payment.delete);

  // Delete all payments
  router.delete("/",  payment.deleteAll);

  app.use("/api/payment", router);
};
