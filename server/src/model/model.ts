import mongoose from "mongoose";
import { userSchema } from "./users";

export let userModel = null;

export const registerModels = () => {
    userModel = mongoose.model("users", userSchema);
}
