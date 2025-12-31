const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const port = 3000;

const publicPath = (p = "") => path.join(__dirname, "public", p);

app.get("/favicon.ico", (req, res) => {
  res.sendFile(publicPath("assets/images/icons/favicon.ico"));
})

app.use(express.static(publicPath()));

app.get("/", (req, res) => {
  res.sendFile(publicPath("index.html"));
})

const redirects = {
  "/nexa": "/apps/nexa"
}

for (const key of Object.keys(redirects)) {
  app.get(key, (req, res) => {
    res.redirect(redirects[key]);
  })
}

app.use((req, res) => {
  res.status(404).sendFile(publicPath("404/index.html"));
})

app.listen(port, () => {
  console.log("Server is running on port", port)
})