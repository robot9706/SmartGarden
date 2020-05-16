import mongoose from "mongoose";

export const plantsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    internalID: { type: String, required: true },
    waterPerDay: { type: Number, required: true },
    requiredTemperature: { type: Array, required: true, default: [ 15, 25 ] },
    requiredHumidity: { type: Array, required: true, default: [ 40, 70 ] }
});
