const express = require("express");
const router = express.Router();

const {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
} = require("../controllers/notificationController");

router.post("/", createNotification);
router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;