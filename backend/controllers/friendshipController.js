import { Friendship } from "../models/friendshipModel.js";
import { User } from "../models/userModel.js";

// ✅ Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id; // assuming auth middleware sets req.user

    if (requesterId.toString() === recipientId) {
      return res.status(400).json({ message: "You cannot add yourself as a friend" });
    }

    // check if request already exists
    const existing = await Friendship.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const newRequest = new Friendship({
      requester: requesterId,
      recipient: recipientId,
    });

    await newRequest.save();
    res.status(201).json({ message: "Friend request sent", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Friendship.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Friend request accepted", data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Friendship.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Friend request rejected", data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Friends of a User
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    })
      .populate("requester", "fullName username profilePhoto")
      .populate("recipient", "fullName username profilePhoto");

    // format output → return the "other user"
    const formatted = friends.map(f =>
      f.requester._id.toString() === userId.toString() ? f.recipient : f.requester
    );

    res.json({ friends: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Pending Requests for a User
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friendship.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "fullName username profilePhoto");

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
