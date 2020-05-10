import mongoose from "mongoose";
import { userSchema } from "./users";
import { gardenSchema } from "./garden";

export let userModel = null;
export let gardenModel = null;

export const registerModels = () => {
    userModel = mongoose.model("users", userSchema);
    gardenModel = mongoose.model("gardens", gardenSchema);
}
