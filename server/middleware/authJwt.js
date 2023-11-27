const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const { TokenExpiredError } = jwt;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log("Access token is expired");

      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    console.log("Access token is still valid");
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    let userToken = req.headers["x-access-token"];

    if (!userToken) {
      return res.status(403).send({
        message: "No token provided",
      });
    }

    const user = await User.findOne({ where: { token: userToken } });
    if (!user)
      return res
        .status(401)
        .send({ message: `User with token ${userToken} was not found` });
    const userRoles = await user.getRoles();

    for (let i = 0; i < userRoles.length; i++) {
      if (userRoles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).send({
      message: "Require Admin Role",
    });
  } catch (err) {
    return res.status(500).send({
      message: `Internal server error : ${err}`,
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
module.exports = authJwt;
