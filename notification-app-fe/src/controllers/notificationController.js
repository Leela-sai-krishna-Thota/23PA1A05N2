const Notification = require("../models/Notification");

// Create notification
const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        await Notification.update(
            { isRead: true },
            { where: { id } }
        );

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        await Notification.destroy({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: "Notification deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
};