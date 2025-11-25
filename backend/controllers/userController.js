import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, email, confirmPassword } = req.body;
        if (!fullName || !username || !password || !email || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            email,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
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

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET
            //  || "derdvfbgedvb34we3423ewveqg4vbvrrtgf"
             , { expiresIn: '1d' });
        console.log(token)

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
        console.log("edc", loggedInUserId);
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
        return res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
    }
}
export const profile = async (req, res) => {
    try {
        console.log("id", req.id);
        const userProfile = await User.findById(req.id).select("-password");

        console.log("usr", userProfile);
        return res.status(200).json({ message: "userprofile is getting", userProfile });
    } catch (error) {
        console.log(error);
    }
}

export const getMe = async (req, res) => {
    try {
        console.log("usrer", req.id);
        if (!mongoose.isValidObjectId(req.id)) {
            console.log("id")
        }
        const user = await User.findById(req.id).select("-password");
        console.log(user)
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}


// PUT /user/profile
export const updateUserProfile = async (req, res) => {
    try {
        console.log(req.id)
        const userId = req.id;
        const { fullName, email } = req.body;

        // build update object
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (email) updateFields.email = email;

        // if file uploaded by multer
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