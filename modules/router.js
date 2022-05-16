require("dotenv").config({ path: "../.env" });
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const middleware = require("./middleware");
const assistant = require("./assistant");
const presets = require("./presets");

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

router.get("/run", middleware.verifyJWT, async (req, res) => {
  let { preset, command } = req.query;
  if (preset && !command) {
    let getcmd = presets[preset.toLowerCase()];
    if (getcmd) {
      command = getcmd;
      preset = null;
    } else {
      return res.status(400).send("Invalid preset");
    }
  }
  if (!preset && command) {
    try {
      await assistant.run(command);
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
    return;
  }
  return res.status(400).send("Please provide either a preset or a command");
});

module.exports = router;
