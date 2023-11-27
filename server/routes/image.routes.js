module.exports = (app) => {
  const image = require("../controllers/image.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new image
  router.post("/", image.create);

  
  // Update an image
  router.put("/", image.update);

  // Retrieve all image
  router.get("/",  image.findAll);

  // Delete an image with id
  router.delete("/:id", image.delete);

  // Delete all images
  router.delete("/",  image.deleteAll);

  app.use("/api/image", router);
};
