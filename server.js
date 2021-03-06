require("dotenv").config();
const express = require("express");
// const assistant = require("./modules/assistant");
const helmet = require("helmet");
const slowdown = require("express-slow-down");
const ratelimit = require("express-rate-limit");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  slowdown({
    windowMs: 5 * 60 * 1000, // 15 minutes
    delayAfter: 50,
    delayMs: 500,
  })
);

app.use(
  ratelimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

const router = require("./modules/router");
app.use(router);

app.use(function (_req, res) {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
