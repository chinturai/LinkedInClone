import User from '../models/user.model.js';
import ConnectionRequest from './../models/connectionRequest.model.js';
import Notification from './../models/notification.model.js';
import { sendConnectionAcceptedEmail } from '../emails/emailHandlers.js';

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

        // Send Connection Accepted EMAIL 
        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

        try {
            await sendConnectionAcceptedEmail( senderEmail , senderName , recipientName , profileUrl);
        } catch (error) {
            console.log("Error in sendConnectionAcceptedEmail");
        }

    } catch (error) {
        console.log("Error in Connection Controller (acceptConnectionRequest)");
        res.status(500).json({ message: "Internal Server Error (acceptConnectionRequest) " });
    }
}

export const rejectConnectionRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await ConnectionRequest.findById(requestId);

        //Can not reject someone else's Request
		if (request.recipient.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to reject this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "rejected";
		await request.save();

		res.json({ message: "Connection request rejected" });

	} catch (error) {
		console.log("Error in Connection Controller (rejectConnectionRequest)");
        res.status(500).json({ message: "Internal Server Error (rejectConnectionRequest) " });
	}
};

export const getConnectionRequests = async (req, res) => {
    //Function for getting all the connection requests of an user
	try {
		const userId = req.user._id;

        //Find all connection requests where we are the Reciever
		const requests = await ConnectionRequest.find({ recipient: userId, status: "pending" }).populate(
			"sender",
			"name username profilePicture headline connections"
		);

		res.json(requests);

	} catch (error) {
		console.log("Error in Connection Controller (getConnectionRequests)");
        res.status(500).json({ message: "Internal Server Error (getConnectionRequests) " });
	}
};


export const getUserConnections = async (req, res) => {
    //To get all ur connections
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).populate(
			"connections",
			"name username profilePicture headline connections"
		);

		res.json(user.connections);
	} catch (error) {
		console.log("Error in Connection Controller (getUserConnections)");
        res.status(500).json({ message: "Internal Server Error (getUserConnections) " });
	}
};

export const removeConnection = async (req, res) => {
    // To delete someone from your already made connection list
	try {
		const myId = req.user._id;
		const { userId } = req.params;

        //If u remove someone from ur connection , even u will get removed from their connections list
		await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
		await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

		res.json({ message: "Connection removed successfully" });

	} catch (error) {
		console.log("Error in Connection Controller (removeConnection)");
        res.status(500).json({ message: "Internal Server Error (removeConnection) " });
	}
};

export const getConnectionStatus = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		const currentUserId = req.user._id;

		const currentUser = req.user;
		if (currentUser.connections.includes(targetUserId)) {
			return res.json({ status: "connected" });
		}

		const pendingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: currentUserId, recipient: targetUserId },
				{ sender: targetUserId, recipient: currentUserId },
			],
			status: "pending",
		});

		if (pendingRequest) {
			if (pendingRequest.sender.toString() === currentUserId.toString()) {
				return res.json({ status: "pending" });
			} else {
				return res.json({ status: "received", requestId: pendingRequest._id });
			}
		}

		// if no connection or pending req found
		res.json({ status: "not_connected" });
        
	} catch (error) {
		console.log("Error in Connection Controller (getConnectionStatus)");
        res.status(500).json({ message: "Internal Server Error (getConnectionStatus) " });
	}
};

