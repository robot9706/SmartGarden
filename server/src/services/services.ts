import { initUserService } from "./userService"
import { initGardenService } from "./gardenService";

export const initServices = (router) => {
    initUserService(router);
    initGardenService(router);
}