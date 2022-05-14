require("dotenv").config({ path: "../.env" });
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const middleware = require("./middleware");
const assistant = require("./assistant");

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
  return res.sendStatus(401);
});

router.get("/lights/on", middleware.verifyJWT, async (req, res) => {
  try {
    await assistant.run("Turn on the lights");
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/lights/off", middleware.verifyJWT, async (req, res) => {
  try {
    await assistant.run("Turn off the lights");
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
