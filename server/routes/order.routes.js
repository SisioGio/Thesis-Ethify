module.exports = (app) => {
  const order = require("../controllers/order.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new order
  router.post("/", order.create);

  // Update an order
  router.put("/", order.update);

  // Retrieve all order
  router.get("/", order.findAll);

  // Retrieve all purchase orders
  router.get("/purchase/:companyId", order.findPurchaseOrders);

  // Retrieve all sales orders
  router.get("/sale/:companyId", order.findSalesOrders);

  // Delete an order with id
  router.delete("/:id", order.delete);

  // Delete all orders
  router.delete("/", order.deleteAll);

  app.use("/api/order", router);
};
