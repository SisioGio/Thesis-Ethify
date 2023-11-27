module.exports = (app) => {
  const address = require("../controllers/address.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new address
  router.post("/", address.create);

  
  // Update an address
  router.put("/", address.update);

  // Retrieve all address
  router.get("/",  address.findAll);

  // Delete an address with id
  router.delete("/:id", address.delete);

  // Delete all addresss
  router.delete("/",  address.deleteAll);

  app.use("/api/address", router);
};
