import User from '../models/user.model.js';
import ConnectionRequest from './../models/connectionRequest.model.js';
import Notification from './../models/notification.model.js';

export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString() === userId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        if (req.user.connections.includes(userId)) {
            return res.status(400).json({ message: "You are already connected" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A connection request already exists" });
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId,
        });

        await newRequest.save();

        res.status(201).json({ message: "Connection request sent successfully" });

    } catch (error) {
        console.log("Error in Connection Controller (sendConnectionRequest)");
        res.status(500).json({ message: "Internal Server Error (sendConnectionRequest) " });
    }
};

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId)
            .populate("sender", "name email username")
            .populate("recipient", "name username");

        if (!request) return res.status(404).json({ message: "Connection Request not found " });

        //check if the Request is for u ?
        if (request.recipient._id.toString() !== userId.toString()) return res.status(403).json({ message: "Cannot accept this request !! " });

        if (request.status !== "pending") return res.status(400).json({ message: "Request has already been processed" });

        request.status = "accepted";

        await request.save();

        // After accepting connection req , Each other's ID Should be present in connection array of both users
        // Eg. If u r in my connection list, then even i shld be there in ur connection list 
        await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } });

        //Create a new notification 
        const notification = new Notification(
            {
                recipient: request.sender._id,
                type: "connectionAccepted",
                relatedUser : userId
            }
        )

        await notification.save();

        res.json({message: "Connection accepted successfully"});

        //ToDo Send Connection Accepted Email
        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

        try {
            
        } catch (error) {
            
        }

    } catch (error) {
        console.log("Error in Connection Controller (acceptConnectionRequest)");
        res.status(500).json({ message: "Internal Server Error (acceptConnectionRequest) " });
    }
}

export const rejectConnectionRequest = async (req, res) => {

}

export const getConnectionRequests = async (req, res) => {

}


export const getUserConnections = async (req, res) => {

}


export const removeConnection = async (req, res) => {

}


export const getConnectionStatus = async (req, res) => {

}

