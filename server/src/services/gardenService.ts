import passport from "passport";
import mongoose from "mongoose";
import { addSecurity, getSessionUserID } from "../security";
import { gardenModel } from "../model/model";
import { CELL_COUNT } from "../model/garden";
import { EMPTY_CELL } from "../model/garden";

const ACTION_CHANGE_PLANT = "ACTION_CHANGE_PLANT";

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
        cells: empty_cells
    });

    newGarden.save((error) => {
        if (error) {
            console.log(error);

            res.status(500).send({
                ok: false,
                error: error.toString()
            });
        } else {
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
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                ok: false,
                error: err.toString()
            })
        } else {
            res.status(200).send({
                ok: true,
                gardens: data
            })
        }
    });
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

    res.send({
        ok: true,
        data: {
            temperature: 20,
            humidity: 50
        }
    });
}

const cell_info = (req, res) => {
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

    gardenModel.findOne({
        _id: gid,
        owner: uid
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                ok: false,
                error: err.toString()
            })
        } else {
            res.status(200).send({
                ok: true,
                data: {
                    cell: data.cells[cid],
                    actions: [
                        ACTION_CHANGE_PLANT
                    ]
                }
            })
        }
    });
}

const cell_actions = {
    ACTION_CHANGE_PLANT: (garden, cell_index, action_data) => {
        return new Promise((resolve, reject) => {
            if (action_data.new_plant == null) {
                return { ok: false, error: "Missing plant!" };
            }
    
            garden.cells[cell_index].content = action_data.new_plant;
            garden.markModified("cells");

            garden.save((err) => {
                if (err) {
                    resolve({
                        ok: false,
                        error: err.toString()
                    });
                } else {
                    resolve({
                        ok: true,
                        error: null
                    })
                }
            })
        });
    }
}

const cell_action = (req, res) => {
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

    gardenModel.findOne({
        _id: garden_id,
        owner: uid
    }, async (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                ok: false,
                error: err.toString()
            })
        } else {
            const { ok, error } = await cell_actions[action](data, cell_index, action_data);
            res.status(200).send({
                ok: ok,
                error: error
            });
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
}