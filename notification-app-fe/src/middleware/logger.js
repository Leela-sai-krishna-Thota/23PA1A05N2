const axios = require("axios");

const Log = async (stack, level, packageName, message) => {
    try {
        await axios.post("TEST_SERVER_API_URL", {
            stack,
            level,
            package: packageName,
            message
        });

        console.log("Log sent successfully");
    } catch (error) {
        console.error("Logging failed:", error.message);
    }
};

module.exports = Log;