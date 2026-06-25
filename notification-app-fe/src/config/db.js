const { Sequelize } = require("sequelize");

// Create database connection
const sequelize = new Sequelize(
    "college_db",      // Database name
    "postgres",        // PostgreSQL username
    "yourpassword",    // PostgreSQL password
    {
        host: "localhost",
        dialect: "postgres",
        logging: false
    }
);

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

connectDB();

module.exports = sequelize;