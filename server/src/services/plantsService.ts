import passport from "passport";
import mongoose from "mongoose";
import { addSecurity, getSessionUserID } from "../security";
import { handleError } from "./services";
import { plantModel } from "../model/model";

const plantInfo = async (req, res) => {
    let plants = req.query.plant;
    if (!Array.isArray(plants)) {
        plants = [ plants ]; // String to one element array
    }

    let resultArray: any= {};

    for (var i = 0; i < plants.length; i++) {
        const result = await (new Promise((resolve, reject) => {
            plantModel.findOne({
                internalID: plants[i]
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                }

                resolve(data);
            });
        }));

        if (result == null) {
            console.warn(`No plant info for ${plants[i]}`);
        } else {
            resultArray[plants[i]] = result;
        }
    }

    res.send({
        ok: true,
        data: resultArray
    });
}

export const initPlantsService = (router) => {
    router.route("/plant_info").get(plantInfo);
    addSecurity("/plant_info");
}