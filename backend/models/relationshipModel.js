import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate relationships
relationshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const Relationship = mongoose.model('Relationship', relationshipSchema);
