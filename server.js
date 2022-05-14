require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
