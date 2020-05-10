import passport from "passport";
import { addSecurity, getSessionUserID } from "../security";
import { gardenModel } from "../model/model";
import { CELL_COUNT } from "../model/garden";
import { EMPTY_CELL } from "../model/garden";

const create = (req, res) => {
    const data = req.body;
    const { name } = data;

    const uid = getSessionUserID(req);

    let empty_cells = [];
    for (let x = 0; x < CELL_COUNT; x++) {
        empty_cells.push({
            index: x,
            content: EMPTY_CELL
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

export const initGardenService = (router) => {
    router.route("/garden_create").post(create);
    addSecurity("/garden_create");

    router.route("/garden_all").get(get_all);
    addSecurity("/garden_all");
}