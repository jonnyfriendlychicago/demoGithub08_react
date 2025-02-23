// below is CG refactor of Feb 2025 code, related to AWS secrets manaager

const express = require("express");
const cors = require("cors");
const path = require("path");
const AWS = require("aws-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure AWS Secrets Manager
const secretsManager = new AWS.SecretsManager({
    region: "us-east-2", // Replace with your AWS region, e.g., "us-east-1"
});

// Function to fetch secrets from AWS Secrets Manager
async function getSecrets(secretName) {
    try {
        const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        return JSON.parse(secret.SecretString);
    } catch (err) {
        console.error("Error fetching secrets:", err);
        process.exit(1);
    }
}

// Function to start the server after fetching secrets
async function startServer() {
    // Load secrets
    const secrets = await getSecrets("my-app-secrets");

    // Set environment variables from secrets
    process.env.VITE_DADA_NAME = secrets.VITE_DADA_NAME;
    // below: examples from CG
    // process.env.VITE_API_URL = secrets.VITE_API_URL;
    // process.env.ANOTHER_SECRET = secrets.ANOTHER_SECRET;

    // Use CORS middleware
    app.use(cors());

    // Serve static files from the frontend build
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Handle React routing, return index.html for non-API routes
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });

    // Example API route (to verify the secret)
    app.get("/api/secrets", (req, res) => {
        res.json({ message: "Secrets loaded", apiUrl: process.env.VITE_DADA_NAME });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Start the server only after fetching secrets
startServer();





// // Feb 2025, using CORS (not sure how imporant this is, just trying to maintain 2023 design)

// const express = require("express");
// const cors = require("cors"); // NEW
// const path = require("path");
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Use CORS middleware
// app.use(cors());

// // Serve static files from the frontend build
// app.use(
//   express.static(path.join(__dirname, "../client/dist"))
// );

// // Handle React routing, return index.html for non-API routes
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

// app.listen(PORT, () => {
//     console.log();
// });
// // Example API route
// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello from Express!" });
// });
