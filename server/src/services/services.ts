import { initUserService } from "./userService"
import { initGardenService } from "./gardenService";
import { initGardenerService } from "./gardenerService";
import { initPlantsService } from "./plantsService";

export const handleError = (error, res) => {
    if (error == null) {
        return false;
    }

    console.error(error);
    res.send({
        ok: false,
        error: error.toString()
    });

    return true;
}

export const initServices = (router) => {
    initUserService(router);
    initGardenService(router);
    initGardenerService(router);
    initPlantsService(router);
}