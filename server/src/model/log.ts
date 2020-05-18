import mongoose from "mongoose";

export const logSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, required: true },
    garden: { type: mongoose.Types.ObjectId, required: true },
    otherUser: { type: mongoose.Types.ObjectId, required: false },
    date: { type: Date, required: true },
    event: { type: String, required: true },
});
