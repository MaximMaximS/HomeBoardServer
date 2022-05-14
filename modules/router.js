require("dotenv").config({ path: "../.env" });
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const middleware = require("./middleware");

router.post("/login", (req, res) => {
  // Get username and password from request body
  const { username, password } = req.body;
  // Check if username and password are valid
  if (
    username === process.env.LOGIN &&
    bcrypt.compareSync(password, process.env.PASSWORD)
  ) {
    // Generate a token
    const token = jwt.sign(
      {
        username: username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).send({
      token: token,
    });
  }
  // 401
  return res.status(401).send("Invalid username or password");
});

router.get("/protected", middleware.verifyJWT, (req, res) => {
  return res.status(200).send("You are authenticated");
});

module.exports = router;
