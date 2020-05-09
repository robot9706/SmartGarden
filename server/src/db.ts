import mongoose from "mongoose";
import { registerModels } from "./model/model";

const dbUrl = 'mongodb://localhost:27017'; // :D

export const connectToDB = () => {
    registerModels();

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        dbName: "SmartGarden"
    }).then(result => {
        console.log("Connected to database!");
    })
    .catch(err => {
        console.error("Failed to connect to database!");
        console.error(err);
    });
}
