module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new user
  router.post("/", user.register);
  router.get("/is_authenticated", [authJwt.verifyToken], user.isAuthenticated);
    // Login 
    router.post("/login", user.login);
  // Update an user
  router.put("/", user.update);

  // Retrieve all user
  router.get("/",  user.findAll);

  // Delete an user with id
  router.delete("/:id", user.delete);

  // Delete all users
  router.delete("/",  user.deleteAll);

  app.use("/api/user", router);
};
