import mongoose from "mongoose";

export const gardenerSchema = new mongoose.Schema({
    garden: { type: mongoose.Types.ObjectId, required: true },
    gardener: { type: mongoose.Types.ObjectId, required: true },
});
