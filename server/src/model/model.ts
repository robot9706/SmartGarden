import mongoose from "mongoose";
import { userSchema } from "./users";
import { gardenSchema } from "./garden";
import { gardenerSchema } from "./gardener";
import { plantsSchema } from "./plants";

export let userModel = null;
export let gardenModel = null;
export let gardenerModel = null;
export let plantModel = null;

export const registerModels = () => {
    userModel = mongoose.model("users", userSchema);
    gardenModel = mongoose.model("gardens", gardenSchema);
    gardenerModel = mongoose.model("gardener", gardenerSchema);
    plantModel = mongoose.model("plants", plantsSchema);
}
