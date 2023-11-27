module.exports = (app) => {
  const product = require("../controllers/product.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new product
  router.post("/", product.create);

  
  // Update an product
  router.put("/", product.update);

  // Retrieve all product
  router.get("/",  product.findAll);

  // Delete an product with id
  router.delete("/:id", product.delete);

  // Delete all products
  router.delete("/",  product.deleteAll);

  app.use("/api/product", router);
};
