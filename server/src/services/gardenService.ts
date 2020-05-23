import passport from "passport";
import mongoose from "mongoose";
import { addSecurity, getSessionUserID } from "../security";
import { gardenModel, gardenerModel } from "../model/model";
import { CELL_COUNT } from "../model/garden";
import { EMPTY_CELL } from "../model/garden";
import { handleError } from "./services";
import { logData } from "./logService";

const ACTION_REQUEST_PLANT_CHANGE = "ACTION_REQUEST_PLANT_CHANGE";
const ACTION_CONFIRM_PLANT_CHANGE = "ACTION_CONFIRM_PLANT_CHANGE";

const isOwner = (gardenID, userID) => {
    return new Promise((resolve, reject) => {
        gardenModel.find({
            owner: userID,
            _id: gardenID
        }, (err, result) => {
            if (err) reject(err);
            else if (result != null && result.length == 1) {
                resolve(1);
            } else {
                gardenerModel.find({
                    garden: gardenID,
                    gardener: userID
                }, (err, result) => {
                    if (err) reject(err);
                    else if (result != null && result.length == 1) {
                        resolve(0);
                    }
                    else {
                        resolve(null);
                    }
                })
            }
        })
    });
}

const randomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const create = (req, res) => {
    const data = req.body;
    const { name } = data;

    const uid = getSessionUserID(req);

    let empty_cells = [];
    for (let x = 0; x < CELL_COUNT; x++) {
        empty_cells.push({
            index: x,
            content: EMPTY_CELL,
            temperature: 20,
            humidity: 50
        });
    }

    const newGarden = new gardenModel({
        name: name,
        owner: uid,
        cells: empty_cells,
        heating: 0,
        watering: 0
    });

    newGarden.save((error, data) => {
        if (!handleError(error, res)) {
            logData(data._id, uid, null, "GARDEN_CREATE");

            res.status(200).send({
                ok: true,
                error: null
            })
        }
    });
}

const get_all = (req, res) => {
    const uid = getSessionUserID(req);

    gardenModel.find({
        owner: uid
    }, (err, ownGardens) => {
        if (!handleError(err, res)) {
            gardenerModel.find({
                gardener: uid
            }, (err, gardening) => {
                if (!handleError(err, res)) {
                    const filtered = gardening.map(x => x.garden);
                    
                    gardenModel.find({
                        _id: {
                            $in: filtered
                        }
                    }, (err, notOwnGardens) => {
                        if (!handleError(err, res)) {
                            res.send({
                                ok: true,
                                data: {
                                    own: ownGardens,
                                    other: notOwnGardens
                                }
                            })
                        }
                    })
                }
            })
        }
    })
};

const get_info = (req, res) => {
    if (req.query.garden_id == null) {
        return res.send({
            ok: false,
            error: "Missing parameter"
        });
    }

    const uid = getSessionUserID(req);
    const gid = req.query.garden_id;

    gardenModel.findOne({
        _id: gid
    }, (err, garden) =>{
        if (!handleError(err, res)) {

            gardenerModel.aggregate([
                {
                    $match: 
                    {
                        garden: new mongoose.Types.ObjectId(gid)
                    }
                },
                {
                    $lookup: 
                    {
                        from: "users",
                        localField: "gardener",
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
                    $project: 
                    {
                        _id: 0,
                        gardenerUsername: "$userData.username",
                        gardenerID: "$userData._id",
                    }  
                }
            ], (err, gardeners) => {
                if (!handleError(err, res)) {         
                    res.send({
                        ok: true,
                        data: {
                            gardeners: gardeners,
                            heating: garden.heating,
                            watering: garden.watering,
                            // Valós adatok "emulálása"
                            temperature: (garden.heating ? 25 : 15) + (randomInt(10) - 5),
                            humidity: (40 + garden.watering * 15) + (randomInt(10) - 5)
                        }
                    });
                }
            })
        }
    })
}

const cell_info = async (req, res) => {
    if (req.query.garden_id == null || req.query.cell_index == null) {
        return res.send({
            ok: false,
            error: "Missing parameter"
        });
    }

    const uid = getSessionUserID(req);
    const gid = req.query.garden_id;
    const cid = req.query.cell_index;

    if (cid < 0 || cid >= CELL_COUNT) {
        return res.send({
            ok: false,
            error: "Invalid cell_index"
        });
    }

    const ownType = await isOwner(gid, uid);
    if (ownType == null) {
        return res.send({
            ok: false,
            error: "No permission"
        });
    }

    gardenModel.findOne({
        _id: gid
    }, (err, data) => {
        if (!handleError(err, res)) {
            // Valós adatok "emulálása"
            for (var i = 0; i < data.cells.length; i++) {
                data.cells[i].temperature = (20 + data.heating * 8) + (randomInt(10) - 5);
                data.cells[i].humidity = (data.watering ? 60 : 40) + (randomInt(10) - 5);
            }

            res.status(200).send({
                ok: true,
                data: {
                    cell: data.cells[cid],
                    actions: [
                        (ownType == 1 ? ACTION_REQUEST_PLANT_CHANGE : ACTION_CONFIRM_PLANT_CHANGE)
                    ]
                }
            })
        }
    });
}

const cell_actions = {
    ACTION_REQUEST_PLANT_CHANGE: (garden, userID, ownType, cell_index, action_data) => {
        return new Promise(async (resolve, reject) => {
            if (action_data.new_plant == null) {
                return resolve ({ ok: false, error: "Missing plant!" });
            }

            if (ownType !== 1) { //Owner
                return resolve ({ ok: false, error: "Invalid action!" });
            }

            garden.cells[cell_index].content_requested = action_data.new_plant;
            garden.markModified("cells");
    
            garden.save((err) => {
                if (err) {
                    resolve({
                        ok: false,
                        error: err.toString()
                    });
                } else {
                    logData(garden, userID, null, `CELL|ACTION_REQUEST_PLANT_CHANGE|${cell_index}|${action_data.new_plant}`);

                    resolve({
                        ok: true,
                        error: null
                    })
                }
            })
        })
    },
    ACTION_CONFIRM_PLANT_CHANGE: (garden, userID, ownType, cell_index, action_data) => {
        return new Promise(async (resolve, reject) => {
            if (ownType !== 0) { //Gardener
                return resolve ({ ok: false, error: "Invalid action!" });
            }

            if (garden.cells[cell_index].content_requested == null) {
                return resolve ({ ok: false, error: "No change requested!" }); 
            }

            garden.cells[cell_index].content = action_data.content_requested;
            garden.cells[cell_index].content_requested = null;
            garden.markModified("cells");
    
            garden.save((err) => {
                if (err) {
                    resolve({
                        ok: false,
                        error: err.toString()
                    });
                } else {
                    logData(garden, userID, null, `CELL|ACTION_CONFIRM_PLANT_CHANGE|${cell_index}|${action_data.content_requested}`);

                    resolve({
                        ok: true,
                        error: null
                    })
                }
            })
        })
    }
}

const cell_action = async (req, res) => {
    const data = req.body;
    const { garden_id, cell_index, action, action_data } = data;

    if (garden_id == null || cell_index == null || action == null) {
        return res.send({
            ok: false,
            error: "Missing parameter"
        });
    }

    if (cell_index < 0 || cell_index >= CELL_COUNT) {
        return res.send({
            ok: false,
            error: "Invalid cell_index"
        });
    }

    if (cell_actions[action] == null) {
        return res.send({
            ok: false,
            error: "Unknown action!"
        });
    }

    const uid = getSessionUserID(req);
    const ownType = await isOwner(garden_id, uid);
    if (ownType == null) {
        return res.send({
            ok: false,
            error: "Invalid garden!"
        })
    }

    gardenModel.findOne({
        _id: garden_id
    }, async (err, data) => {
        if (!handleError(err, res)) {
            const { ok, error } = await cell_actions[action](data, uid, ownType, cell_index, action_data);
            res.status(200).send({
                ok: ok,
                error: error
            });
        }
    });
}

const garden_control = async (req, res) => {
    if (req.body.garden == null || (req.body.heating == null && req.body.watering == null)) {
        return res.send({
            ok: false,
            error: "Mising parameters!"
        });
    }

    const uid = getSessionUserID(req);
    const ownType = await isOwner(req.body.garden, uid);
    if (ownType == null) {
        return res.send({
            ok: false,
            error: "Invalid garden!"
        })
    }

    gardenModel.findOne({
        _id: req.body.garden
    }, (err, garden) => {
        if (!handleError(err, res)) {
            let logText: any[] = [];

            if (req.body.heating != null) {
                garden.heating = req.body.heating;
                garden.markModified("heating");

                if (garden.heating == 1) {
                    logText.push("HEATING");
                } else if (garden.heating == -1) {
                    logText.push("COOLING");
                }
            }
    
            if (req.body.watering != null) {
                garden.watering = req.body.watering;
                garden.markModified("watering");

                if (garden.watering == 1) {
                    logText.push("WATERING");
                } else if (garden.watering == 0) {
                    logText.push("NO_WATERING");
                }
            }
            
            garden.save((err) => {
                if (!handleError(err, res)) {
                    logData(garden, uid, null, `GARDEN_CONTROL|${logText.join("|")}`);

                    return res.send({
                        ok: true,
                        error: null
                    })
                }
            })
        }
    });
}

export const initGardenService = (router) => {
    router.route("/garden_create").post(create);
    addSecurity("/garden_create");

    router.route("/garden_all").get(get_all);
    addSecurity("/garden_all");

    router.route("/garden_info").get(get_info); //garden_info?garden_id=XYZ
    addSecurity("/garden_info");

    router.route("/garden_cell_info").get(cell_info); //garden_cell_info?garden_id=XYZ&cell_index=0
    addSecurity("/garden_cell_info");

    router.route("/garden_cell_action").post(cell_action);
    addSecurity("/garden_cell_action");

    router.route("/garden_control").post(garden_control);
    addSecurity("/garden_control");
}