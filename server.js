const express = require("express");
const sequelize = require("./src/config/db");
const Log = require("./src/middleware/logger");

// Import Notification model
require("./src/models/Notification");

// Import routes
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();

// Middleware
app.use(express.json());

/* Home Route */
app.get("/", async (req, res) => {
    await Log("backend", "info", "route", "Home route accessed");

    res.status(200).json({
        success: true,
        message: "Welcome to Notification System API"
    });
});

/* Error Route (for testing logger) */
app.get("/error", async (req, res) => {
    try {
        let x = y; // intentional error
    } catch (err) {
        await Log("backend", "error", "handler", err.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

/* Notification Routes */
app.use("/notifications", notificationRoutes);

/* Sync database */
sequelize.sync()
    .then(() => {
        console.log("Database connected successfully");
        console.log("Notifications table created successfully");
    })
    .catch((err) => {
        console.log("Database error:", err.message);
    });

/* Start Server */
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});