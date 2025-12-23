import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Friendship } from "../models/FriendListModel.js";

export const register = async (req, res) => {
    try {
        const { password, email, confirmPassword } = req.body;
        if (!password || !email || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exit try different" });
        }

        // Generate fullName and username
        const fullName = email.split('@')[0];
        const username = `${fullName}${Math.floor(Math.random() * 10000)}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            email,
            age: null,
            hobbies: [],
            popularityScore: 0
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET || "derdvfbgedvb34we3423ewveqg4vbvrrtgf", { expiresIn: '1d' });


        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({ token: token }
        );
    } catch (error) {
        console.log(error);
    }
}


export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}


export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}


export const allUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {}
        if (search) {
            query = {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { username: { $regex: search, $options: "i" } }
                ]
            };
        }
        const allUsers = await User.find(query).select("-password");
        const friendRequests = await Friendship.find(req.id).select("-password");
        console.log(friendRequests)
        
        return res.status(200).json({allUsers,friendRequests});
    } catch (error) {
        console.log(error);
    }
}


export const profile = async (req, res) => {
    try {
        const userId = req.query.userId || req.id;

        // 1. Get user profile
        const userProfile = await User.findById(userId).select("-password");

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Get all friendships in ONE query
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
        })
            .populate("requester", "fullName username profilePhoto")
            .populate("recipient", "fullName username profilePhoto");

        // 3. Separate friends & requests
        const friendList = [];
        const friendRequests = [];

        friendships.forEach((friendship) => {
            if (friendship.status === "accepted") {
                const friend =
                    friendship.requester._id.toString() === userId
                        ? friendship.recipient
                        : friendship.requester;

                friendList.push(friend);
            }

            if (
                friendship.status === "pending" &&
                friendship.recipient._id.toString() === userId
            ) {
                friendRequests.push(friendship.requester);
            }
        });

        // 4. Single response object
        return res.status(200).json({
            message: "Profile fetched successfully",
            userProfile,
            friendList,
            friendRequests,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getMe = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.id)) {
            console.log("id")
        }
        const user = await User.findById(req.id).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}


export const updateUserProfile = async (req, res) => {
    try {
        console.log(req.id)
        const userId = req.id;
        const { fullName, email, age, hobbies } = req.body;

        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (email) updateFields.email = email;
        if (age) updateFields.age = age;
        if (hobbies) updateFields.hobbies = hobbies;

        if (req.file) {
            const filePath = req.file.path
            const result = await uploadOnCloudinary(filePath);
            updateFields.profilePhoto = result.url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check friendship status
        let friendshipStatus = "none"; // none, pending, accepted, rejected
        let friendshipId = null;
        let isSender = false;

        const friendship = await Friendship.findOne({
            $or: [
                { requester: currentUserId, recipient: userId },
                { requester: userId, recipient: currentUserId }
            ]
        });

        if (friendship) {
            friendshipStatus = friendship.status;
            friendshipId = friendship._id;
            isSender = friendship.requester.toString() === currentUserId;
        }

        res.status(200).json({ user, friendshipStatus, friendshipId, isSender });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};