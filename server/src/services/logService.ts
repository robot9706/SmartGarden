import passport from "passport";
import mongoose from "mongoose";
import { addSecurity, getSessionUserID } from "../security";
import { gardenModel, gardenerModel, logModel } from "../model/model";
import { handleError } from "./services";

const logGet = (req, res) => {
    const data = req.query;
    const { garden } = data;

    if (garden == null) {
        return res.send({
            ok: false,
            error: "Missing parameters!"
        });
    }

    logModel.aggregate([
        {
            $match: 
            {
                garden: new mongoose.Types.ObjectId(garden)
            }
        },
        {
            $sort:
            {
                date: -1
            }
        },

        {
            $lookup: 
            {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind:
            {
                path: "$userData",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: 
            {
                from: "users",
                localField: "otherUser",
                foreignField: "_id",
                as: "otherUserData"
            }
        },
        {
            $unwind:
            {
                path: "$otherUserData",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: 
            {
                from: "gardens",
                localField: "garden",
                foreignField: "_id",
                as: "gardenData"
            }
        },
        {
            $unwind: "$gardenData"
        },

        {
            $project: {
                garden: 1,
                date: 1,
                event: 1,

                performedBy: "$userData.username",
                performedByID: "$userData._id",
                performedOn: "$otherUserData.username",
                performedOnID: "$otherUserData._id",

                gardenName: "$gardenData.name"
            }  
        }
    ], (err, data) => {
        if (!handleError(err, res)) {
            return res.send({
                ok: true,
                data: data
            })
        }
    })
}

export const logData = (gardenID, userID, otherUserID, eventName) => {
    let newEntry = new logModel({
        user: userID,
        garden: gardenID,
        otherUser: otherUserID,
        date: new Date(),
        event: eventName,
    });

    newEntry.save((error) => {
        if (error) {
            console.log(error);
        }
    });
}

export const initLogService = (router) => {
    router.route("/log").get(logGet);
    addSecurity("/log");
}