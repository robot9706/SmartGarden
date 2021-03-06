import passport from "passport";
import mongoose from "mongoose";
import { addSecurity, getSessionUserID } from "../security";
import { gardenModel, gardenerModel, userModel } from "../model/model";
import { handleError } from "./services";
import { logData } from "./logService";

const gardenerAdd = (req, res) => {
    const data = req.body;
    const { garden, gardener } = data;

    if (garden == null || gardener == null) {
        return res.send({
            ok: false,
            error: "Missing parameters!"
        });
    }

    const uid = getSessionUserID(req);

    userModel.findOne({
        username: gardener
    }, (error, gardenerUser) => {
        if (!handleError(error, res)) {
            if (gardenerUser == null) {
                return res.send({
                    ok: false,
                    error: "Gardener user not found!"
                });
            }

            const gardenerID = gardenerUser._id;
            if (gardenerID == uid) {
                return res.send({
                    ok: false,
                    error: "Invalid gardener user!"
                });
            }

            gardenModel.findOne({
                _id: garden,
                owner: uid
            }, (error, data) => {
                if (error || data == null) {
                    console.log(error);
                    return res.send({
                        ok: false,
                        error: "Unknown garden!"
                    });
                } else {
                    gardenerModel.findOne({
                        garden: garden,
                        gardener: gardenerID  
                    }, (error, data) => {
                        if (!handleError(error, res)) {
                            if (data == null) {
                                let newGardener = new gardenerModel({
                                    garden: garden,
                                    gardener: gardenerID
                                });
                    
                                newGardener.save((error) => {
                                    if (error) {
                                        console.log(error);
                                        return res.send({
                                            ok: false,
                                            error: error.toString()
                                        })
                                    } else {
        
                                        logData(garden, uid, gardenerID, "GARDENER_ADDED");
                                        
                                        return res.send({
                                            ok: true,
                                            error: null
                                        })
                                    }
                                });
                            } else {
                                return res.send({
                                    ok: false,
                                    error: "Already added!"
                                })
                            }
                        }
                    })
                }
            });
        }
    });
};

const gardenerRemove = (req, res) => {
    const data = req.body;
    const { garden, gardener } = data;

    if (garden == null || gardener == null) {
        return res.send({
            ok: false,
            error: "Missing parameters!"
        });
    }

    const uid = getSessionUserID(req);

    gardenerModel.deleteOne({
        garden: garden,
        gardener: gardener
    }, (err) => {
        if (!handleError(err, res)) {

            logData(garden, uid, gardener, "GARDENER_REMOVED");

            return res.send({
                ok: true,
                error: null
            });
        }
    })
};

export const initGardenerService = (router) => {
    router.route("/gardener_add").post(gardenerAdd);
    addSecurity("/gardener_add");

    router.route("/gardener_remove").post(gardenerRemove);
    addSecurity("/gardener_remove");
}