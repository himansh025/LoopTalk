import { User } from "../models/userModel.js";
import { Friendship } from "../models/FriendListModel.js";

// Helper to format user node
const formatUserNode = (user, isCurrentUser = false) => ({
    id: user._id.toString(),
    data: {
        label: user.fullName,
        fullName: user.fullName,
        username: user.username,
        profilePhoto: user.profilePhoto,
        hobbies: user.hobbies || [],
        popularityScore: user.popularityScore || 0,
        online: user.online,
        isCurrentUser
    },
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    type: 'custom'
});

// Get friend suggestions based on shared hobbies
export const getHobbySuggestions = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.hobbies || user.hobbies.length === 0) {
            return res.status(200).json([]);
        }

        // Find users who are NOT already friends and share at least one hobby
        // First get friends list to exclude
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted"
        });

        const friendIds = friendships.map(f =>
            f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString()
        );

        const suggestions = await User.find({
            _id: {
                $ne: userId,
                $nin: friendIds
            },
            hobbies: { $in: user.hobbies }
        }).select("fullName username profilePhoto hobbies popularityScore");

        // Calculate relevance score (number of shared hobbies)
        const suggestionsWithScore = suggestions.map(suggestedUser => {
            const sharedHobbies = suggestedUser.hobbies.filter(hobby =>
                user.hobbies.includes(hobby)
            );

            return {
                ...suggestedUser.toObject(),
                sharedHobbiesCount: sharedHobbies.length,
                sharedHobbies
            };
        });

        // Sort by shared hobbies count (descending)
        suggestionsWithScore.sort((a, b) => b.sharedHobbiesCount - a.sharedHobbiesCount);

        res.status(200).json(suggestionsWithScore);
    } catch (error) {
        console.error("Hobby suggestions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get graph data for visualization
export const getGraphData = async (req, res) => {
    try {
        const userId = req.id;

        // 1. Get Current User
        const currentUser = await User.findById(userId).select("fullName username profilePhoto hobbies popularityScore online");
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        // 2. Get Friends
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted"
        }).populate("requester recipient", "fullName username profilePhoto hobbies popularityScore online");

        const friends = friendships.map(f =>
            f.requester._id.toString() === userId ? f.recipient : f.requester
        );

        let nodes = [];
        let edges = [];

        // Add Current User Node
        nodes.push(formatUserNode(currentUser, true));

        // Add Friend Nodes and Edges
        friends.forEach(friend => {
            nodes.push(formatUserNode(friend));
            edges.push({
                id: `e-${userId}-${friend._id}`,
                source: userId,
                target: friend._id.toString(),
                type: 'smoothstep',
                animated: false,
                style: { stroke: "#6b7280", strokeWidth: 2 }
            });
        });

        res.status(200).json({ nodes, edges });
    } catch (error) {
        console.error("Graph data error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add a hobby
export const addHobby = async (req, res) => {
    try {
        const { hobby } = req.body;
        const userId = req.id;

        if (!hobby) {
            return res.status(400).json({ message: "Hobby is required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { hobbies: hobby } },
            { new: true }
        );

        res.status(200).json({ message: "Hobby added", hobbies: user.hobbies });
    } catch (error) {
        console.error("Add hobby error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Remove a hobby
export const removeHobby = async (req, res) => {
    try {
        const { hobby } = req.body;
        const userId = req.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { hobbies: hobby } },
            { new: true }
        );

        res.status(200).json({ message: "Hobby removed", hobbies: user.hobbies });
    } catch (error) {
        console.error("Remove hobby error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
