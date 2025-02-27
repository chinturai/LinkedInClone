import Notification from "../models/notification.model.js"

export const getUserNotifications = async (req, res) => {
    try {
        const notification = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")

        res.status(200).json(notification);
    } catch (error) {
        console.log("Error in Notification Controller (getUserNotifications)");
        res.status(500).json({ message: "Internal Server Error (getUserNotifications) " });
    }
}

export const markNotificationAsRead = async (req, res) => {
    const notidicationId = req.params.id;
    try {
        const notification = await Notification.findByIdAndUpdate(
            {
                _id: notidicationId,
                recipient: req.user._id
            },
            {
                read: true
            },
            { new: true}
        );

        res.json(notification);

    } catch (error) {
        console.log("Error in Notification Controller (markNotificationAsRead)");
        res.status(500).json({ message: "Internal Server Error (markNotificationAsRead) " });
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    try {
        await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user._id
        })

        res.json({ message: "Notification Deleted Successfully ! " });
        
    } catch (error) {
        console.log("Error in Notification Controller (deleteNotification)");
        res.status(500).json({ message: "Internal Server Error (deleteNotification) " });
    }
}