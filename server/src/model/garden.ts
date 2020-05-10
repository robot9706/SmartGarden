import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const CELL_COUNT = 25;

export const EMPTY_CELL = "EMPTY";

export const gardenSchema = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true },
    cells: { type: Array, required: true, default: [ ] }
});
