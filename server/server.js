// 2025, using CORS (not sure how imporant this is, just trying to maintain 2023 design)

const express = require("express");
const cors = require("cors"); // NEW
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Serve static files from the frontend build
app.use(
  express.static(path.join(__dirname, "../client/dist"))
);

// Handle React routing, return index.html for non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
    console.log();
});
// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});
