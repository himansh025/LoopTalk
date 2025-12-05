import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["male", "female", "not prefer"],
    default: "not prefer"
  },
  age: {
    type: Number,
    min: 1,
    max: 150
  },
  hobbies: [{
    type: String,
    trim: true
  }],
  popularityScore: {
    type: Number,
    default: 0,
    min: 0
  },
  online: {
    type: Boolean,
    default: false
  },
  friendRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
      }
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });
export const User = mongoose.model("User", userModel);