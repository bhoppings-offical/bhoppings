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
  "/nexa": "/apps/nexa",
  "/apps": "/app-library"
}

for (const key of Object.keys(redirects)) {
  app.get(key, (req, res) => {
    res.redirect(redirects[key]);
  })
}


const NAMESPACE = 'bhoppings';
const COUNTER   = 'view-count';

// Proxy endpoint to get current count
app.get('/api/views', async (req, res) => {
  try {
    const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER}/`);
    if (!response.ok) throw new Error('CounterAPI error');
    const text = await response.text();
    const data = JSON.parse(text); // parse manually
    res.json({ value: data.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch views' });
  }
});

// Proxy endpoint to increment count
app.get('/api/views/up', async (req, res) => {
  try {
    const response = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER}/up`);
    if (!response.ok) throw new Error('CounterAPI error');
    const text = await response.text();
    const data = JSON.parse(text); // parse manually
    res.json({ value: data.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to increment views' });
  }
});


app.use((req, res) => {
  res.status(404).sendFile(publicPath("404/index.html"));
})

app.listen(port, () => {
  console.log("Server is running on port", port)
})